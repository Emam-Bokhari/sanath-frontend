'use client';

import React, { useEffect } from 'react';
import { apiFetch } from '@/lib/api-fech';
import { Breadcrumb, Button } from 'antd';
import { Heart, MapPin, Share2 } from 'lucide-react';
import { isUserLoggedIn } from '@/services/auth.service';
import { notification } from 'antd';
import Link from 'next/link';
import { getAllBadges, formatActivityDate } from '@/lib/badge-utils';
import PropertyBadge from '@/components/common/PropertyBadge';

export const PropertyHeader = ({ data }: any) => {
  const [isFavorite, setIsFavorite] = React.useState(data?.isFavorite);
  const isLogin = isUserLoggedIn();
  const [api, contextHolder] = notification.useNotification();

  const badges = getAllBadges(data);
  const activityInfo = formatActivityDate(data);

  useEffect(() => {
    setIsFavorite(data?.isFavorite);
  }, [data?.isFavorite]);

  const handleToogleSave = async () => {
    if (!isLogin) {
      api.error({
        message: "Please login to save properties",
        description: <span className="text-gray-500">Please <Link className='text-[#0f2d5e] font-semibold' href="/auth/login">login</Link> or <Link className='text-[#0f2d5e] font-semibold' href="/auth/signup">register</Link> to save properties</span>,
        placement: "topRight",
      });
      return
    }
    if (!data?._id) return;
    const nextState = !isFavorite;
    setIsFavorite(nextState);

    try {
      await apiFetch("/favorite-properties/toggle", {
        body: JSON.stringify({
          listingId: data._id
        }),
        method: "POST"
      }, 'client');
    } catch (error) {
      console.log('favorite toggle error', error);
      setIsFavorite(!nextState); // Revert state on network/API failure
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: data?.title || 'Check out this property!',
      text: `Take a look at this property: ${data?.title || ''}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(shareData.url);
        api.success({
          message: 'Link copied to clipboard!',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <Breadcrumb
          separator=">"
          items={[
            { title: 'Home', href: '/' },
            { title: data?.title || 'Property Detail' },
          ]}
        />
      </div>
      {contextHolder}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* Badges & Market Status Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            {badges.map((b) => (
              <PropertyBadge key={b.code} badge={b} size="sm" />
            ))}

            {data?.listingType && (
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#14b8a6] text-white shadow-sm">
                {data.listingType === "RENT" ? "To Rent" : "For Sale"}
              </span>
            )}

            {activityInfo.text && (
              <span className="text-xs text-gray-500 font-medium ml-1">
                {activityInfo.text}
              </span>
            )}

            {data?.originalPrice && data.originalPrice > (data?.askingPrice ?? 0) && (
              <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded line-through">
                Was £{data.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{data?.title}</h1>
          {data?.location?.address && (
            <p className="text-gray-500 flex items-center gap-2">
              <MapPin size={16} />
              {data.location.address}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex gap-3 mt-2 md:mt-0">
            <Button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 font-semibold text-base border border-gray-200 text-gray-700 hover:!border-[#14b8a6] hover:!text-[#14b8a6] transition-all duration-300"
            >
              <Share2
                size={18}
                className="text-gray-500 hover:scale-110 transition-all duration-300"
              />
              <span>Share</span>
            </Button>
            <Button
              onClick={handleToogleSave}
              className={`flex items-center justify-center gap-2 rounded-xl h-12 px-6 font-semibold text-base border transition-all duration-300 ${isFavorite
                ? 'border-rose-100 bg-rose-50/80 text-rose-600 hover:!border-rose-200 hover:!text-rose-700 hover:!bg-rose-100/80 shadow-sm shadow-rose-100/50'
                : 'text-gray-700 border-gray-200 hover:!border-[#14b8a6] hover:!text-[#14b8a6]'
                }`}
            >
              <Heart
                size={18}
                className={`transition-all duration-300 ${isFavorite
                  ? 'fill-rose-600 stroke-rose-600 scale-110'
                  : 'text-gray-500 hover:scale-110'
                  }`}
              />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
