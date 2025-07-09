import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Twitter, Github, Linkedin, Sparkles, Home, Shield, TrendingUp } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-3">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                PropertyTokens
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Democratizing real estate investment through blockchain technology. 
              Invest in premium properties with fractional ownership and earn passive income.
            </p>
            <div className="flex space-x-6">
              <div className="group bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <Twitter className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <div className="group bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <Github className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <div className="group bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <Linkedin className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Platform
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Dashboards
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard" className="group flex items-center text-indigo-300 hover:text-indigo-200 transition-colors hover:translate-x-1 transform duration-300">
                  <TrendingUp className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Investor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/owner" className="group flex items-center text-emerald-300 hover:text-emerald-200 transition-colors hover:translate-x-1 transform duration-300">
                  <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Property Owner
                </Link>
              </li>
              <li>
                <Link to="/admin" className="group flex items-center text-red-300 hover:text-red-200 transition-colors hover:translate-x-1 transform duration-300">
                  <Shield className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 PropertyTokens. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
              <span className="text-gray-400 text-sm">Powered by blockchain technology</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;