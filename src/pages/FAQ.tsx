import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What is tokenized real estate?",
      answer: "Tokenized real estate involves converting physical property into digital tokens on a blockchain. Each token represents a fractional ownership stake in the property, allowing multiple investors to own shares of a single property."
    },
    {
      question: "How do I start investing?",
      answer: "To start investing, you need to: 1) Connect your crypto wallet, 2) Browse available properties, 3) Choose your investment amount, 4) Purchase property tokens. The minimum investment is typically $100."
    },
    {
      question: "How are rental income distributions handled?",
      answer: "Rental income is automatically distributed to token holders proportionally to their ownership stake. Distributions are made quarterly and sent directly to your connected wallet."
    },
    {
      question: "What fees are involved?",
      answer: "We charge a 2% management fee on rental income and a 1% transaction fee on property purchases. All fees are clearly disclosed before any transaction."
    },
    {
      question: "Can I sell my property tokens?",
      answer: "Yes, property tokens can be traded on our secondary marketplace. Liquidity may vary depending on the property and market conditions."
    },
    {
      question: "How are properties selected and vetted?",
      answer: "Our team of real estate experts conducts thorough due diligence on all properties, including financial analysis, legal compliance checks, and market research before listing."
    },
    {
      question: "What happens if a property needs major repairs?",
      answer: "Major repairs are funded from property reserves or through special assessments. Token holders are notified and can vote on significant expenditures exceeding certain thresholds."
    },
    {
      question: "Is this regulated?",
      answer: "Yes, we operate under applicable securities regulations and maintain compliance with all relevant laws. Property tokens are considered securities and are subject to regulatory oversight."
    },
    {
      question: "What are the risks involved?",
      answer: "Like all investments, tokenized real estate carries risks including market volatility, liquidity constraints, property-specific risks, and regulatory changes. Please review our risk disclosure documents."
    },
    {
      question: "How do I track my investments?",
      answer: "Your investment dashboard provides real-time updates on your portfolio, including property performance, rental income, and token values. You can also view detailed transaction history."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions about tokenized real estate investing
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">{faq.question}</span>
              {openItems.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {openItems.includes(index) && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
        <p className="text-gray-600 mb-6">
          Our team is here to help you understand tokenized real estate investing.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default FAQ;