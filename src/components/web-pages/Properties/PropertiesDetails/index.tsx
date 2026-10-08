import React from 'react';
import { PropertyHeader } from './PropertyHeader';
import { PropertyGallery } from './PropertyGallery';
import { PropertyContent } from './PropertyContent';
import { PropertySidebar } from './PropertySidebar';

const PropertiesDetails = ({ data }: { data: any }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <PropertyHeader data={data} />

        {/* Gallery Section */}
        <PropertyGallery data={data} />

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Info (Takes up 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <PropertyContent data={data} />
          </div>

          {/* Sidebar Info (Takes up 1 column on large screens) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PropertySidebar data={data} />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4">
          <a
            href={`tel:${data?.agentId?.phone || ''}`}
            className="flex-1 bg-[#14b8a6] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-[#119e8e] hover:text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            Call
          </a>
          <a
            href={`mailto:${data?.agentId?.email || ''}`}
            className="flex-1 bg-[#0f2d5e] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-[#0a1f42] hover:text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertiesDetails;