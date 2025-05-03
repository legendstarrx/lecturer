'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function AgencyPage() {
  const [activeTab, setActiveTab] = useState<'tiktok' | 'facebook'>('tiktok');

  const features = [
    "Best ROI in the industry",
    "Highest eCPM optimization",
    "Premium quality traffic",
    "24/7 campaign monitoring",
    "Expert ad strategy development",
    "Regular performance reports",
    "A/B testing implementation",
    "Audience targeting optimization",
    "Creative optimization",
    "Budget management"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 mb-6">
              Professional Ad Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Maximize your advertising ROI with our expert ad management services. 
              We handle everything from strategy to execution, ensuring you get the best results.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('tiktok')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  activeTab === 'tiktok'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                TikTok Ads
              </button>
              <button
                onClick={() => setActiveTab('facebook')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  activeTab === 'facebook'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Facebook Ads
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Flexible Pricing Options</h2>
            <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="gradient-card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fixed Monthly Rate</h3>
              <p className="text-4xl font-bold text-indigo-600 mb-6">₦50,000<span className="text-lg text-gray-500">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Perfect for consistent monthly budgets</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No hidden fees</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Predictable costs</span>
                </li>
              </ul>
            </div>
            <div className="gradient-card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance-Based</h3>
              <p className="text-4xl font-bold text-indigo-600 mb-6">10%<span className="text-lg text-gray-500"> of ad spend</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pay only for results</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ideal for scaling campaigns</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cost-effective for high spenders</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Ad Management?</h2>
            <p className="text-xl text-gray-600">We deliver exceptional results through our proven strategies</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="gradient-card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform-Specific Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {activeTab === 'tiktok' ? 'TikTok Ads Management' : 'Facebook Ads Management'}
            </h2>
            <p className="text-xl text-gray-600">
              {activeTab === 'tiktok'
                ? 'Leverage the power of TikTok to reach your target audience'
                : 'Maximize your reach with Facebook\'s powerful advertising platform'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="gradient-card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <ul className="space-y-4">
                {activeTab === 'tiktok' ? (
                  <>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Creative video content optimization</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Trend analysis and implementation</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Hashtag strategy development</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Advanced audience targeting</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Lookalike audience creation</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Retargeting strategy implementation</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="gradient-card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Results You Can Expect</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Higher conversion rates</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lower cost per acquisition</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Increased return on ad spend</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Boost Your Ad Performance?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Let's discuss how we can help you achieve your advertising goals
          </p>
          <a
            href={`https://wa.me/2348130000000?text=${encodeURIComponent(
              `Hi! I'm interested in your ${activeTab === 'tiktok' ? 'TikTok' : 'Facebook'} Ad Management services.\n\n` +
              `I'd like to know more about:\n` +
              `- ${activeTab === 'tiktok' ? 'TikTok' : 'Facebook'} ad management\n` +
              `- Pricing options (₦50,000/month or 10% of ad spend)\n` +
              `- Expected ROI and eCPM optimization\n` +
              `- Campaign setup process\n\n` +
              `Please provide more details about your services.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
} 