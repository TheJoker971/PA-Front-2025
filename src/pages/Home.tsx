import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, TrendingUp, Shield, Globe, Sparkles, Zap } from 'lucide-react';
import { mockProperties } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';

const Home: React.FC = () => {
  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-4 shadow-2xl">
                <Building2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
              Invest in Real Estate
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                With Blockchain
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-gray-200 leading-relaxed">
              Fractional ownership of premium properties. Earn passive income with tokenized real estate investments starting from just $100.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/properties"
                className="group inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105"
              >
                <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
                Explore Properties
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-6">
            <Zap className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-indigo-800 font-semibold">Why Choose PropertyTokens?</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            Revolutionary Technology Meets Real Estate
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of property investment with blockchain-powered fractional ownership
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-indigo-100 hover:border-indigo-200 transform hover:-translate-y-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fractional Ownership</h3>
            <p className="text-gray-600 leading-relaxed">
              Invest in premium properties with as little as $100. Own a piece of real estate without the traditional barriers.
            </p>
          </div>
          
          <div className="group bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-100 hover:border-emerald-200 transform hover:-translate-y-2">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Passive Income</h3>
            <p className="text-gray-600 leading-relaxed">
              Earn regular rental income from your property investments. Automatic distributions to your wallet.
            </p>
          </div>
          
          <div className="group bg-gradient-to-br from-white to-violet-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-violet-100 hover:border-violet-200 transform hover:-translate-y-2">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Transparent</h3>
            <p className="text-gray-600 leading-relaxed">
              Blockchain technology ensures complete transparency and security for all transactions and ownership records.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-gradient-to-br from-gray-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-6">
              <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-indigo-800 font-semibold">Featured Properties</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Premium Investment Opportunities
            </h2>
            <p className="text-xl text-gray-600">
              Discover carefully curated real estate investments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link
              to="/properties"
              className="group inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105"
            >
              View All Properties
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                $50M+
              </div>
              <div className="text-gray-300 font-medium">Total Value Locked</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                8.2%
              </div>
              <div className="text-gray-300 font-medium">Average Annual Yield</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                1,200+
              </div>
              <div className="text-gray-300 font-medium">Active Investors</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                45
              </div>
              <div className="text-gray-300 font-medium">Properties Listed</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;