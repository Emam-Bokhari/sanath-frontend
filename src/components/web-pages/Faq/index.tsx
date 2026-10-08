'use client';

import { Collapse } from 'antd';
import PageHeader from '@/components/shared/PageHeader';

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FaqPageProps {
  faqs: {
    faqs: Faq[];
  } | Faq[];
}

export const FaqPage = ({ faqs }: FaqPageProps) => {
  // Handle both possible prop formats from the API response
  const faqList = Array.isArray(faqs) ? faqs : faqs?.faqs || [];

  const customExpandIcon = ({ isActive }: any) => (
    <div className={`transition-transform duration-300 ${isActive ? 'rotate-90' : ''}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  const faqItems = faqList.map((faq) => ({
    key: faq._id,
    label: <span className="text-base font-bold text-gray-900">{faq.question}</span>,
    children: (
      <div className="px-1 pb-4">
        <p className="text-gray-600 leading-relaxed text-[15px]">{faq.answer}</p>
      </div>
    ),
    className: "bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-[#14b8a6] transition-all duration-300 shadow-sm",
  }));

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 md:pb-20">
      <PageHeader title="FAQ" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f2d5e] mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            Find answers to the most common questions about managing your properties and account.
          </p>
        </div>

        {/* Single FAQ List Modernized */}
        <div className="w-full">
          <Collapse 
            ghost 
            expandIcon={customExpandIcon}
            expandIconPosition="end"
            className="faq-collapse flex flex-col gap-4"
            defaultActiveKey={faqList.length > 0 ? [faqList[0]._id] : []}
            items={faqItems}
          />
          
          {faqList.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No FAQs available at the moment.</p>
            </div>
          )}
        </div>

        {/* Contact Support CTA */}
        <div className="mt-16 bg-[#0f2d5e] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-[#14b8a6] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-64 h-64 bg-[#14b8a6] rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">Still have questions?</h3>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                    If you couldn't find the answer you were looking for, our friendly support team is here to help you 24/7.
                </p>
                <button className="bg-[#14b8a6] hover:bg-[#119e8e] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105">
                    Contact Support
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
