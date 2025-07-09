import React from 'react';
import { Palette, Type, Layout, Sparkles, Building2, TrendingUp, Shield, Zap, Gift, Star } from 'lucide-react';

const StyleGuide: React.FC = () => {
  const colors = {
    primary: [
      { name: 'Indigo 50', value: '#eef2ff', class: 'bg-indigo-50' },
      { name: 'Indigo 100', value: '#e0e7ff', class: 'bg-indigo-100' },
      { name: 'Indigo 500', value: '#6366f1', class: 'bg-indigo-500' },
      { name: 'Indigo 600', value: '#4f46e5', class: 'bg-indigo-600' },
      { name: 'Indigo 700', value: '#4338ca', class: 'bg-indigo-700' },
      { name: 'Indigo 900', value: '#312e81', class: 'bg-indigo-900' },
    ],
    secondary: [
      { name: 'Purple 50', value: '#faf5ff', class: 'bg-purple-50' },
      { name: 'Purple 100', value: '#f3e8ff', class: 'bg-purple-100' },
      { name: 'Purple 500', value: '#a855f7', class: 'bg-purple-500' },
      { name: 'Purple 600', value: '#9333ea', class: 'bg-purple-600' },
      { name: 'Purple 700', value: '#7c3aed', class: 'bg-purple-700' },
      { name: 'Purple 900', value: '#581c87', class: 'bg-purple-900' },
    ],
    accent: [
      { name: 'Cyan 400', value: '#22d3ee', class: 'bg-cyan-400' },
      { name: 'Cyan 500', value: '#06b6d4', class: 'bg-cyan-500' },
      { name: 'Blue 400', value: '#60a5fa', class: 'bg-blue-400' },
      { name: 'Blue 500', value: '#3b82f6', class: 'bg-blue-500' },
      { name: 'Blue 600', value: '#2563eb', class: 'bg-blue-600' },
    ],
    success: [
      { name: 'Emerald 50', value: '#ecfdf5', class: 'bg-emerald-50' },
      { name: 'Emerald 100', value: '#d1fae5', class: 'bg-emerald-100' },
      { name: 'Emerald 500', value: '#10b981', class: 'bg-emerald-500' },
      { name: 'Emerald 600', value: '#059669', class: 'bg-emerald-600' },
      { name: 'Teal 500', value: '#14b8a6', class: 'bg-teal-500' },
      { name: 'Teal 600', value: '#0d9488', class: 'bg-teal-600' },
    ],
    warning: [
      { name: 'Amber 500', value: '#f59e0b', class: 'bg-amber-500' },
      { name: 'Orange 500', value: '#f97316', class: 'bg-orange-500' },
      { name: 'Yellow 400', value: '#facc15', class: 'bg-yellow-400' },
    ],
    neutral: [
      { name: 'Gray 50', value: '#f9fafb', class: 'bg-gray-50' },
      { name: 'Gray 100', value: '#f3f4f6', class: 'bg-gray-100' },
      { name: 'Gray 200', value: '#e5e7eb', class: 'bg-gray-200' },
      { name: 'Gray 600', value: '#4b5563', class: 'bg-gray-600' },
      { name: 'Gray 700', value: '#374151', class: 'bg-gray-700' },
      { name: 'Gray 900', value: '#111827', class: 'bg-gray-900' },
    ]
  };

  const gradients = [
    { name: 'Primary', class: 'bg-gradient-to-r from-indigo-600 to-purple-600' },
    { name: 'Hero', class: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800' },
    { name: 'Success', class: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    { name: 'Accent', class: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
    { name: 'Warning', class: 'bg-gradient-to-r from-amber-500 to-orange-500' },
    { name: 'Background', class: 'bg-gradient-to-br from-gray-50 via-white to-indigo-50' },
  ];

  const components = [
    {
      name: 'Primary Button',
      component: (
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          Primary Action
        </button>
      )
    },
    {
      name: 'Secondary Button',
      component: (
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-semibold border border-indigo-600 hover:bg-indigo-50 transition-all duration-300">
          Secondary Action
        </button>
      )
    },
    {
      name: 'Success Button',
      component: (
        <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg">
          Success Action
        </button>
      )
    },
    {
      name: 'Input Field',
      component: (
        <input
          type="text"
          placeholder="Enter value..."
          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
        />
      )
    },
    {
      name: 'Card',
      component: (
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Card Title</h3>
          <p className="text-gray-600">Card content with description text.</p>
        </div>
      )
    },
    {
      name: 'Badge - Active',
      component: (
        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
          Active
        </span>
      )
    },
    {
      name: 'Badge - Funded',
      component: (
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
          Funded
        </span>
      )
    },
    {
      name: 'Progress Bar',
      component: (
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-3/4 transition-all duration-700 shadow-lg"></div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-6">
            <Palette className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-indigo-800 font-semibold">Design System</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            PropertyTokens Style Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete design system and brand guidelines for the PropertyTokens platform
          </p>
        </div>

        {/* Brand Identity */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Building2 className="h-8 w-8 mr-3 text-indigo-600" />
            Brand Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Logo</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-3">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  PropertyTokens
                </span>
              </div>
              <p className="text-gray-600">Modern, tech-forward logo combining real estate and blockchain elements</p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Typography</h3>
              <div className="space-y-3">
                <div className="text-4xl font-bold text-gray-900">Heading 1</div>
                <div className="text-2xl font-bold text-gray-900">Heading 2</div>
                <div className="text-xl font-semibold text-gray-900">Heading 3</div>
                <div className="text-lg font-medium text-gray-700">Body Large</div>
                <div className="text-base text-gray-600">Body Regular</div>
                <div className="text-sm text-gray-500">Body Small</div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Palette className="h-8 w-8 mr-3 text-indigo-600" />
            Color Palette
          </h2>
          
          {Object.entries(colors).map(([category, colorArray]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">{category} Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {colorArray.map((color) => (
                  <div key={color.name} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <div className={`${color.class} w-full h-16 rounded-xl mb-3 shadow-inner`}></div>
                    <div className="text-sm font-semibold text-gray-900">{color.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{color.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Gradients */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Sparkles className="h-8 w-8 mr-3 text-indigo-600" />
            Gradient System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gradients.map((gradient) => (
              <div key={gradient.name} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                <div className={`${gradient.class} w-full h-20 rounded-xl mb-3 shadow-inner`}></div>
                <div className="text-sm font-semibold text-gray-900">{gradient.name}</div>
                <div className="text-xs text-gray-500 font-mono">{gradient.class}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Layout className="h-8 w-8 mr-3 text-indigo-600" />
            UI Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {components.map((comp) => (
              <div key={comp.name} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{comp.name}</h3>
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl">
                  {comp.component}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Icons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Star className="h-8 w-8 mr-3 text-indigo-600" />
            Icon System
          </h2>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
              {[Building2, TrendingUp, Shield, Zap, Gift, Star, Sparkles, Palette].map((Icon, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 mb-2">
                    <Icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <span className="text-xs text-gray-600 text-center">{Icon.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Zap className="h-8 w-8 mr-3 text-indigo-600" />
            Design Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Modern & Premium</h3>
              <p className="text-gray-600">Clean, sophisticated design with premium feel using gradients and shadows</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trust & Security</h3>
              <p className="text-gray-600">Visual elements that convey security, transparency, and reliability</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border border-cyan-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive & Engaging</h3>
              <p className="text-gray-600">Smooth animations, hover effects, and micro-interactions</p>
            </div>
          </div>
        </section>

        {/* Spacing System */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Layout className="h-8 w-8 mr-3 text-indigo-600" />
            Spacing System
          </h2>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-16 text-sm font-mono text-gray-600">8px</div>
                <div className="bg-indigo-200 h-2" style={{ width: '8px' }}></div>
                <div className="ml-4 text-sm text-gray-600">Small spacing</div>
              </div>
              <div className="flex items-center">
                <div className="w-16 text-sm font-mono text-gray-600">16px</div>
                <div className="bg-indigo-300 h-2" style={{ width: '16px' }}></div>
                <div className="ml-4 text-sm text-gray-600">Medium spacing</div>
              </div>
              <div className="flex items-center">
                <div className="w-16 text-sm font-mono text-gray-600">24px</div>
                <div className="bg-indigo-400 h-2" style={{ width: '24px' }}></div>
                <div className="ml-4 text-sm text-gray-600">Large spacing</div>
              </div>
              <div className="flex items-center">
                <div className="w-16 text-sm font-mono text-gray-600">32px</div>
                <div className="bg-indigo-500 h-2" style={{ width: '32px' }}></div>
                <div className="ml-4 text-sm text-gray-600">Extra large spacing</div>
              </div>
              <div className="flex items-center">
                <div className="w-16 text-sm font-mono text-gray-600">64px</div>
                <div className="bg-indigo-600 h-2" style={{ width: '64px' }}></div>
                <div className="ml-4 text-sm text-gray-600">Section spacing</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StyleGuide;