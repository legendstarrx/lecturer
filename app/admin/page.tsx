'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface Submission {
  id: string;
  wordpressUrl: string;
  wordpressUsername: string;
  wordpressPassword: string;
  whatsappNumber: string;
  package: string;
  receiptFile: string;
  receiptFileName: string;
  receiptFileType: string;
  timestamp: any;
  userId: string;
  status: 'pending' | 'rejected' | 'completed';
  networkCode?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  features: string[];
  whatsappNumber: string;
  price: string;
}

const GradientSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({ 
    title: '', 
    description: '', 
    features: [''],
    whatsappNumber: '',
    price: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Submission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchSubmissions();
        fetchCourses();
      } else {
        setIsAuthenticated(false);
        router.push('/');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'submissions'));
      const submissionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
      setSubmissions(submissionsData.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()));
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Failed to load submissions. Please refresh the page.');
    }
  };

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      
      // Remove any potential duplicates based on ID
      const uniqueCourses = coursesData.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [] as Course[]);
      
      setCourses(uniqueCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to load courses. Please refresh the page.');
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'courses'), {
        ...newCourse,
        features: newCourse.features.filter(feature => feature.trim() !== ''),
        timestamp: new Date()
      });
      setNewCourse({ 
        title: '', 
        description: '', 
        features: [''],
        whatsappNumber: '',
        price: ''
      });
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      // Delete the course from Firebase
      const courseRef = doc(db, 'courses', id);
      await deleteDoc(courseRef);
      
      // Update local state to remove the course
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
      
      // Fetch courses again to ensure we're in sync with Firebase
      await fetchCourses();
      
      alert('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'submissions', id));
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const viewReceipt = (submission: Submission) => {
    setSelectedReceipt(submission);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.toDate()).toLocaleString();
  };

  const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
  const currentSubmissions = submissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'rejected' | 'completed') => {
    try {
      const submissionRef = doc(db, 'submissions', id);
      await updateDoc(submissionRef, { status: newStatus });
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };

  const openWhatsApp = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const openWordPressUrl = (url: string) => {
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GradientSpinner />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 gradient-card">
          <h2 className="text-3xl font-bold text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="gradient-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="gradient-input"
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="gradient-button w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => auth.signOut()}
            className="text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>

        {/* Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Payment Receipt</h3>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedReceipt.receiptFileType.startsWith('image/') ? (
                <img
                  src={selectedReceipt.receiptFile}
                  alt="Payment Receipt"
                  className="max-w-full h-auto"
                />
              ) : (
                <iframe
                  src={selectedReceipt.receiptFile}
                  className="w-full h-[80vh]"
                  title="Payment Receipt"
                />
              )}
            </div>
          </div>
        )}

        {/* Submissions Section */}
        <section className="gradient-card mb-12">
          <h2 className="text-2xl font-semibold mb-6">Recent Submissions</h2>
          <div className="overflow-x-auto w-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}>
            <style jsx global>{`
              ::-webkit-scrollbar {
                height: 8px;
                width: 8px;
              }
              ::-webkit-scrollbar-track {
                background: #F3F4F6;
                border-radius: 4px;
              }
              ::-webkit-scrollbar-thumb {
                background: #9CA3AF;
                border-radius: 4px;
              }
              ::-webkit-scrollbar-thumb:hover {
                background: #6B7280;
              }
            `}</style>
            <div style={{ minWidth: 1400 }} className="whitespace-nowrap">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">WordPress URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap bg-white">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openWordPressUrl(submission.wordpressUrl)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Open WordPress URL"
                          >
                            <span className="text-sm text-gray-900">{submission.wordpressUrl}</span>
                          </button>
                          <button
                            onClick={() => copyToClipboard(submission.wordpressUrl, `url-${submission.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Copy URL"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                          {copied[`url-${submission.id}`] && <span className="text-green-600 text-xs">Copied!</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{submission.wordpressUsername}</span>
                          <button
                            onClick={() => copyToClipboard(submission.wordpressUsername, `username-${submission.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Copy username"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                          {copied[`username-${submission.id}`] && <span className="text-green-600 text-xs">Copied!</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{submission.wordpressPassword}</span>
                          <button
                            onClick={() => copyToClipboard(submission.wordpressPassword, `password-${submission.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Copy password"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                          {copied[`password-${submission.id}`] && <span className="text-green-600 text-xs">Copied!</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.package}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{submission.whatsappNumber}</span>
                          <button
                            onClick={() => openWhatsApp(submission.whatsappNumber)}
                            className="text-green-600 hover:text-green-900"
                            title="Open WhatsApp"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => copyToClipboard(submission.whatsappNumber, `whatsapp-${submission.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Copy number"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                          {copied[`whatsapp-${submission.id}`] && <span className="text-green-600 text-xs">Copied!</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.networkCode || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.timestamp?.toDate()).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={submission.status}
                          onChange={(e) => handleUpdateStatus(submission.id, e.target.value as 'pending' | 'rejected' | 'completed')}
                          className={`text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                            submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                            submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewReceipt(submission)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Receipt
                          </button>
                          <button
                            onClick={() => handleDeleteSubmission(submission.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete submission"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>

        {/* Courses Section */}
        <section className="gradient-card">
          <h2 className="text-2xl font-semibold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            Course Management
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="gradient-input"
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Price</label>
                <input
                  type="text"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                  className="gradient-input"
                  placeholder="Enter course price (e.g., ₦10,000)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
              <textarea
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="gradient-input"
                placeholder="Enter course description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
              <input
                type="text"
                value={newCourse.whatsappNumber}
                onChange={(e) => setNewCourse({ ...newCourse, whatsappNumber: e.target.value })}
                className="gradient-input"
                placeholder="Enter WhatsApp number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Features</label>
              <div className="space-y-2">
                {newCourse.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...newCourse.features];
                        newFeatures[index] = e.target.value;
                        setNewCourse({ ...newCourse, features: newFeatures });
                      }}
                      className="gradient-input flex-1"
                      placeholder="Enter feature"
                    />
                    <button
                      onClick={() => {
                        const newFeatures = newCourse.features.filter((_, i) => i !== index);
                        setNewCourse({ ...newCourse, features: newFeatures });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setNewCourse({ ...newCourse, features: [...newCourse.features, ''] })}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  + Add Feature
                </button>
              </div>
            </div>
            <button
              onClick={handleAddCourse}
              className="gradient-button"
            >
              Add Course
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="gradient-card p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-indigo-600 font-semibold">{course.price}</p>
                    <p className="text-gray-600">{course.description}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {course.features.map((feature, index) => (
                        <li key={index} className="text-gray-700">{feature}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500">WhatsApp: {course.whatsappNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setNewCourse({
                          ...course,
                          features: [...course.features]
                        });
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit Course"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Course"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 