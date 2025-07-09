import React from 'react';
import { Shield, Users, TrendingUp, Globe, Award, Lock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About PropertyTokens</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're revolutionizing real estate investment by making premium properties accessible to everyone through blockchain technology and fractional ownership.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Traditional real estate investment has been limited to wealthy individuals and institutions. We believe everyone should have access to high-quality real estate opportunities.
            </p>
            <p className="text-gray-700">
              Through tokenization, we're breaking down barriers and creating a more inclusive investment ecosystem where you can own a piece of premium properties with as little as $100.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$50M+</div>
              <div className="text-gray-600">Total Value Locked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Transparent</h3>
          <p className="text-gray-600">
            All transactions are recorded on the blockchain, ensuring complete transparency and security for your investments.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Passive Income</h3>
          <p className="text-gray-600">
            Earn regular rental income from your property investments, automatically distributed to your wallet.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Globe className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Access</h3>
          <p className="text-gray-600">
            Invest in premium properties worldwide from anywhere, with 24/7 access to your investment portfolio.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
          <p className="text-gray-600">
            Join a community of like-minded investors and participate in governance decisions for platform improvements.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Award className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Curation</h3>
          <p className="text-gray-600">
            Our team of real estate experts carefully selects and vets every property to ensure quality investments.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Regulatory Compliant</h3>
          <p className="text-gray-600">
            We operate within all applicable regulations and maintain the highest standards of legal compliance.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">JS</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">John Smith</h3>
            <p className="text-gray-600">CEO & Founder</p>
            <p className="text-sm text-gray-500 mt-2">15+ years in real estate and fintech</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">SD</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Sarah Davis</h3>
            <p className="text-gray-600">CTO</p>
            <p className="text-sm text-gray-500 mt-2">Blockchain expert and former Google engineer</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">MJ</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Mike Johnson</h3>
            <p className="text-gray-600">Head of Real Estate</p>
            <p className="text-sm text-gray-500 mt-2">Former VP at leading real estate investment firm</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Investing?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of investors who are already earning passive income through tokenized real estate.
        </p>
        <div className="space-x-4">
          <a
            href="/properties"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Explore Properties
          </a>
          <a
            href="/faq"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;