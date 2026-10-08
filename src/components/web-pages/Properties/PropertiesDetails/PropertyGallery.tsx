'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Camera, Video, Maximize, Orbit, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Image from 'next/image';
import { Modal } from 'antd';
import { getImage } from '@/lib/api-fech';
import { getPrimaryBadge } from '@/lib/badge-utils';
import PropertyBadge from '@/components/common/PropertyBadge';

export const PropertyGallery = ({ data }: any) => {
  const [activeTab, setActiveTab] = useState('1');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxType, setLightboxType] = useState<'photos' | 'floorplans'>('photos');

  const primaryBadge = getPrimaryBadge(data);

  // Consolidate dynamic photos and fallback lists cleanly
  const photos = data?.photos && data.photos.length > 0
    ? data.photos
    : [];

  // Dynamically switch image source inside standard lightbox
  const activeLightboxImages = lightboxType === 'floorplans'
    ? (data?.floorPlans && data.floorPlans.length > 0 ? data.floorPlans : [])
    : photos;

  const openLightbox = (index: number) => {
    setLightboxType('photos');
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const openFloorplanLightbox = (index: number) => {
    setLightboxType('floorplans');
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % activeLightboxImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + activeLightboxImages.length) % activeLightboxImages.length);

  return (
    <div className="mb-8">
      <div className="bg-white">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="mb-4 property-gallery-tabs"
          items={[
            {
              key: '1',
              label: (
                <span className="flex items-center gap-2 px-2 sm:px-4 text-sm font-semibold">
                  <Camera size={18} /> Photos
                </span>
              ),
            },
            {
              key: '2',
              label: (
                <span className="flex items-center gap-2 px-2 sm:px-4 text-sm font-semibold">
                  <Video size={18} /> Videos
                </span>
              ),
            },
            {
              key: '3',
              label: (
                <span className="flex items-center gap-2 px-2 sm:px-4 text-sm font-semibold">
                  <Orbit size={18} /> 360 Tour
                </span>
              ),
            },
            {
              key: '4',
              label: (
                <span className="flex items-center gap-2 px-2 sm:px-4 text-sm font-semibold">
                  <Maximize size={18} /> Floorplan
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Render Content Based on Active Tab */}
      {activeTab === '1' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:h-[500px]">
          {/* Main image */}
          <div
            onClick={() => openLightbox(0)}
            className="relative h-[300px] md:h-full w-full rounded-tl-xl rounded-bl-xl overflow-hidden group cursor-pointer shadow-sm border border-gray-100"
          >
            <Image
              src={getImage(photos[0])}
              alt="Main property view"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
              {primaryBadge && (
                <PropertyBadge badge={primaryBadge} size="sm" />
              )}
              {data?.isFeatured && primaryBadge?.code !== "FEATURED" && (
                <PropertyBadge badge={{ code: "FEATURED", label: "Featured" }} size="sm" />
              )}
              <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/10">
                <Camera size={12} />
                <span>1 / {photos.length}</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-bold text-[#1a3c6e] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
              <Maximize size={14} /> View Gallery
            </div>
          </div>

          {/* Small images grid */}
          <div className="grid grid-cols-2 gap-2 h-[300px] md:h-full">
            <div onClick={() => openLightbox(1 % photos.length)} className="relative w-full h-full group cursor-pointer overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={getImage(photos[1 % photos.length])}
                alt="Living Room"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            </div>
            <div onClick={() => openLightbox(2 % photos.length)} className="relative w-full h-full rounded-tr-xl overflow-hidden group cursor-pointer shadow-sm border border-gray-100">
              <Image
                src={getImage(photos[2 % photos.length])}
                alt="Exterior"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            </div>
            <div onClick={() => openLightbox(3 % photos.length)} className="relative w-full h-full group cursor-pointer overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={getImage(photos[3 % photos.length])}
                alt="Kitchen"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            </div>
            <div onClick={() => openLightbox(4 % photos.length)} className="relative w-full h-full rounded-br-xl overflow-hidden group cursor-pointer shadow-sm border border-gray-100">
              <Image
                src={getImage(photos[4 % photos.length])}
                alt="Bathroom"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              {photos.length > 5 ? (
                <div className="absolute inset-0 bg-[#1a3c6e]/70 flex flex-col items-center justify-center transition-all group-hover:bg-[#1a3c6e]/85">
                  <span className="text-white font-bold text-2xl">+{photos.length - 5}</span>
                  <span className="text-white/90 font-semibold text-xs tracking-wide">More Photos</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === '2' && (
        data?.videos && data.videos.length > 0 ? (
          <div
            onClick={() => setIsVideoOpen(true)}
            className="w-full h-[500px] bg-gray-900 rounded-xl overflow-hidden relative flex items-center justify-center group cursor-pointer shadow-sm"
          >
            <Image src={getImage(photos[0])} alt="Video thumbnail" fill className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" unoptimized />
            <div className="absolute z-10 w-24 h-24 bg-[#14b8a6] rounded-full flex items-center justify-center border-4 border-white/30 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#14b8a6]/40">
              <Play size={40} className="text-white fill-white ml-1" />
            </div>
            <p className="absolute bottom-8 left-8 text-white font-bold text-xl drop-shadow-lg">Property Walkthrough</p>
          </div>
        ) : (
          <div className="w-full h-[500px] bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 font-medium">
            <Video size={48} className="text-gray-300 mb-3" />
            <p>No video available for this property listing.</p>
          </div>
        )
      )}

      {activeTab === '3' && (
        data?.threeSixtyTour ? (
          <div className="w-full h-[500px] bg-gray-200 rounded-xl overflow-hidden relative flex items-center justify-center group cursor-pointer shadow-sm">
            <Image src={getImage(data.threeSixtyTour)} alt="360 Tour thumbnail" fill className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" unoptimized />
            <a
              href={getImage(data.threeSixtyTour)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute z-10 bg-white/90 backdrop-blur-md px-8 py-4 rounded-full flex items-center justify-center border border-white/20 group-hover:bg-[#1a3c6e] group-hover:text-white transition-all duration-300 text-[#1a3c6e] font-bold gap-3 shadow-xl"
            >
              <Orbit size={24} /> Enter 360° Interactive Tour
            </a>
          </div>
        ) : (
          <div className="w-full h-[500px] bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 font-medium">
            <Orbit size={48} className="text-gray-300 mb-3" />
            <p>No 360° Virtual Tour available for this property listing.</p>
          </div>
        )
      )}

      {activeTab === '4' && (
        data?.floorPlans && data.floorPlans.length > 0 ? (
          <div className="w-full h-[500px] bg-white border border-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center group shadow-sm p-8">
            <Image src={getImage(data.floorPlans[0])} alt="Full Floorplan" fill className="object-contain p-12 transition-transform duration-700 group-hover:scale-[1.05]" unoptimized />
            <div
              onClick={() => openFloorplanLightbox(0)}
              className="absolute bottom-8 right-8 bg-[#1a3c6e] text-white shadow-xl p-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#14b8a6] transition-all hover:scale-110 active:scale-95"
            >
              <Maximize size={24} />
            </div>
          </div>
        ) : (
          <div className="w-full h-[500px] bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 font-medium">
            <Maximize size={48} className="text-gray-300 mb-3" />
            <p>No floorplan available for this property listing.</p>
          </div>
        )
      )}

      {/* Video Modal Demo */}
      {data?.videos && data.videos.length > 0 && (
        <Modal
          open={isVideoOpen}
          onCancel={() => setIsVideoOpen(false)}
          footer={null}
          width={1000}
          centered
          className="property-video-modal"
          closeIcon={<X size={24} className="text-white hover:text-gray-300" />}
          styles={{
            mask: { backgroundColor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(4px)' },
            content: { background: 'black', padding: 0 }
          }}
        >
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
            <video
              width="100%"
              height="100%"
              src={getImage(data.videos[0])}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
        </Modal>
      )}

      {/* Standard Lightbox Modal */}
      <Modal
        open={isLightboxOpen}
        onCancel={() => setIsLightboxOpen(false)}
        footer={null}
        width="100%"
        centered
        className="property-lightbox-modal"
        closeIcon={<X size={24} className="text-white hover:text-gray-300" />}
        styles={{
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(8px)' },
          content: { background: 'transparent', padding: 0, boxShadow: 'none' }
        }}
      >
        <div className="relative w-full h-[80vh] flex items-center justify-center group">
          {activeLightboxImages.length > 0 && (
            <div className="relative w-full h-full max-w-6xl mx-auto px-4">
              <Image
                src={getImage(activeLightboxImages[currentImageIndex])}
                alt={`${lightboxType === 'floorplans' ? 'Floorplan' : 'Property image'} ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          {/* Navigation */}
          {activeLightboxImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 sm:left-10 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 sm:right-10 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Index Counter */}
          {activeLightboxImages.length > 0 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white/60 font-medium tracking-widest text-xs py-10">
              {currentImageIndex + 1} / {activeLightboxImages.length}
            </div>
          )}
        </div>
      </Modal>

      <style jsx global>{`
        .property-lightbox-modal .ant-modal-content {
          background: transparent !important;
        }
        .property-lightbox-modal .ant-modal-close {
          top: 40px !important;
          right: 40px !important;
        }
      `}</style>
    </div>
  );
};
