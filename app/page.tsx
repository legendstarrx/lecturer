'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { db, auth, initializeAuth } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '@/components/Header';

interface Course {
  id: string;
  title: string;
  description: string;
  features: string[];
  whatsappNumber: string;
  price: string;
}

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

const GradientSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const defaultCourses: Course[] = [
  {
    id: 'normal',
    title: 'Normal Setup',
    description: 'Basic ADX integration and standard optimization with WhatsApp support.',
    features: [
      'Basic ADX integration',
      'Standard optimization',
      'WhatsApp support',
    ],
    whatsappNumber: '',
    price: '₦10,000',
  },
  {
    id: 'premium',
    title: 'Premium Setup',
    description: 'All features in Normal Setup plus lazy loading, less unfilleds, and better eCPM.',
    features: [
      'Everything in normal setup',
      'Lazy loading (optional)',
      'Less Unfilleds',
      'Better eCPM',
    ],
    whatsappNumber: '',
    price: '₦15,000',
  },
  {
    id: 'high',
    title: 'High eCPM Setup',
    description: 'All features in Premium Setup plus best eCPM, no unfilleds, inventory optimization, fast setup, 24/7 WhatsApp support, and a small guide on ADX.',
    features: [
      'Everything in premium setup',
      'Best eCPM',
      'No unfilleds',
      'Inventory optimization',
      'Fast setup',
      '247 WhatsApp support',
      'Small Guide on adx',
    ],
    whatsappNumber: '',
    price: '₦20,000',
  },
];

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<{ email: boolean; account: boolean }>({
    email: false,
    account: false
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeAuth();
        await fetchCourses();
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to initialize application. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const fetchCourses = async () => {
    try {
      // Get fresh data from Firebase without caching
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      
      // Filter out any courses that might have been deleted
      const validCourses = coursesData.filter(course => {
        // Check if the course exists in Firebase
        return course.title && course.description && course.features && course.price;
      });
      
      // If no valid courses found, use default courses
      if (validCourses.length === 0) {
        setCourses(defaultCourses);
      } else {
        setCourses(validCourses);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
      // Fallback to default courses if there's an error
      setCourses(defaultCourses);
    }
  };

  // Add a useEffect to refresh courses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCourses();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData(e.currentTarget);
      const formDataObj: Record<string, string> = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value as string;
      });

      if (!receiptFile) {
        throw new Error('Please upload a payment receipt');
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64File = reader.result as string;
          const submissionData = {
            ...formDataObj,
            receiptFile: base64File,
            receiptFileName: receiptFile.name,
            receiptFileType: receiptFile.type,
            timestamp: new Date(),
            userId: 'anonymous',
            status: 'pending'
          };

          await addDoc(collection(db, 'submissions'), submissionData);
          setSubmitStatus({ success: true, message: 'Submission successful! We will contact you shortly.' });
          if (formRef.current) {
            formRef.current.reset();
          }
          setReceiptFile(null);
          setSelectedPackage('');
        } catch (error) {
          console.error('Error submitting form:', error);
          setSubmitStatus({ success: false, message: 'Error submitting form. Please try again.' });
        } finally {
          setIsSubmitting(false);
        }
      };
      reader.readAsDataURL(receiptFile);
    } catch (error) {
      console.error('Error processing form:', error);
      setSubmitStatus({ success: false, message: error instanceof Error ? error.message : 'Error processing form. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'account') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GradientSpinner />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="gradient-button"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            Welcome to Lecturer
          </h1>
          <p className="text-2xl text-gray-600">Professional ADX Setup Services</p>
        </header>

        <div className="max-w-7xl mx-auto">
          <section className="gradient-card mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                ADX Setup Instructions
              </h2>
              <a
                href="https://wa.me/2349064538679"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button inline-flex items-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="ml-2">Contact Us</span>
              </a>
            </div>
            <div className="bg-white bg-opacity-50 rounded-xl p-4 sm:p-6 mb-8">
              <p className="text-gray-700 mb-4 text-sm sm:text-base">To get started with your ADX setup, please follow these steps:</p>
              <ol className="list-decimal pl-4 sm:pl-6 space-y-3 text-gray-700 text-sm sm:text-base">
                <li>Invite our email to your AdManager as an admin</li>
                <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>Copy our email: <span className="font-mono bg-indigo-100 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">lectureradx@gmail.com</span></span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard('lectureradx@gmail.com', 'email')}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Copy email"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    {copied.email && <span className="text-green-600 text-xs sm:text-sm">Copied!</span>}
                  </div>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>Make payment to our account: <span className="font-mono bg-indigo-100 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">1489346708 ACCESS BANK, ABUBAKAR DAUDA</span></span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard('1489346708', 'account')}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Copy account number"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    {copied.account && <span className="text-green-600 text-xs sm:text-sm">Copied!</span>}
                  </div>
                </li>
                <li>Choose your setup package below</li>
                <li>Submit your WordPress details and payment receipt</li>
                <li>If it is unfilled fix or any work while you already added me please send the network code</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-12">
              <div 
                className={`pricing-card cursor-pointer transition-all duration-300 ${selectedPackage === 'normal' ? 'ring-4 ring-indigo-500' : ''}`}
                onClick={() => setSelectedPackage('normal')}
              >
                <h3 className="text-xl font-semibold mb-2">Normal Setup</h3>
                <p className="text-3xl font-bold text-indigo-600 mb-4">₦10,000</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Basic ADX integration
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Standard optimization
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    WhatsApp support
                  </li>
                </ul>
              </div>
              <div 
                className={`pricing-card featured cursor-pointer transition-all duration-300 ${selectedPackage === 'premium' ? 'ring-4 ring-white' : ''}`}
                onClick={() => setSelectedPackage('premium')}
              >
                <h3 className="text-xl font-semibold mb-2">Premium Setup</h3>
                <p className="text-3xl font-bold mb-4">₦15,000</p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Everything in normal setup
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Lazy loading (optional)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Less Unfilleds
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Better eCPM
                  </li>
                </ul>
              </div>
              <div 
                className={`pricing-card cursor-pointer transition-all duration-300 ${selectedPackage === 'high' ? 'ring-4 ring-indigo-500' : ''}`}
                onClick={() => setSelectedPackage('high')}
              >
                <h3 className="text-xl font-semibold mb-2">High eCPM Setup</h3>
                <p className="text-3xl font-bold text-indigo-600 mb-4">₦20,000</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Everything in premium setup
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Best eCPM
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    No unfilleds
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Inventory optimization
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Fast setup
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    24/7 WhatsApp support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Small Guide on ADX
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
            {submitStatus && (
              <div className={`p-4 rounded-xl ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WordPress URL</label>
              <input
                type="url"
                name="wordpressUrl"
                className="gradient-input"
                placeholder="https://your-wordpress-site.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WordPress Username</label>
              <input
                type="text"
                name="wordpressUsername"
                className="gradient-input"
                placeholder="Your WordPress username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WordPress Password</label>
              <input
                type="password"
                name="wordpressPassword"
                className="gradient-input"
                placeholder="Your WordPress password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
              <input
                type="tel"
                name="whatsappNumber"
                className="gradient-input"
                placeholder="Your WhatsApp number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Receipt</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="gradient-input"
                required
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Submit network code if you have already added our email</p>
              <input
                type="text"
                name="networkCode"
                className="gradient-input"
                placeholder="Enter network code (optional)"
              />
            </div>
            <button
              type="submit"
              className="gradient-button w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <GradientSpinner />
                  <span className="ml-2">Submitting...</span>
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
