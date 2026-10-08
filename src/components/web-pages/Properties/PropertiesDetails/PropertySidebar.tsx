'use client';

import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Phone, FileText, Download } from 'lucide-react';
import { apiFetch, getImage } from '@/lib/api-fech';
import Link from 'next/link';
import { isUserLoggedIn } from '@/services/auth.service';
import { getPrimaryBadge, formatActivityDate } from '@/lib/badge-utils';
import PropertyBadge from '@/components/common/PropertyBadge';
const { TextArea } = Input;

export const PropertySidebar = ({ data }: { data: any }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = notification.useNotification();
  const isLogin = isUserLoggedIn();
  const primaryBadge = getPrimaryBadge(data);
  const activityInfo = formatActivityDate(data);

  // Parse dynamic assets using getImage helper
  const agentImage = data?.agentId?.profileImage
    ? getImage(data.agentId.profileImage)
    : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150";


  const propertyThumb = data?.photos && data.photos[0]
    ? getImage(data.photos[0])
    : "/cardImg.png";

  const priceFormatted = data?.askingPrice
    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(data.askingPrice)
    : data?.price || "£0";

  const handleFinish = async (values: any) => {
    if (!isLogin) {
      messageApi.error({
        message: "Please login to contact agents",
        description: <span className="text-gray-500">Please <Link className='text-[#0f2d5e] font-semibold' href="/auth/login">login</Link> or <Link className='text-[#0f2d5e] font-semibold' href="/auth/signup">register</Link> to contact agents</span>,
        placement: "topRight",
      });
      return
    }
    setLoading(true);

    try {
      const enquiry = await apiFetch("/enquiries", {
        method: "POST",
        body: JSON.stringify({
          listingId: data?._id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          postalCode: values.postalCode || "1207",
          country: values.country || "UK",
          message: values.message,
        }),
      }, 'client');

      if (enquiry) {
        messageApi.success({
          message: "Your message has been sent successfully to the agent!",
          placement: "topRight",
        });
        form.resetFields();
      }
    } catch (error) {
      console.log('enquiry error', error);
      messageApi.error({
        message: "Failed to send your message. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {contextHolder}

      {/* Contact Agent Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Top Property Snippet */}
        <div className="bg-[#0f2d5e] p-4 flex gap-4 items-center">
          <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-white/10">
            <img src={propertyThumb} alt="property" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-bold text-lg leading-tight">{priceFormatted}</p>
              {data?.originalPrice && data.originalPrice > (data?.askingPrice ?? 0) && (
                <span className="text-xs text-white/50 line-through">
                  £{data.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[#14b8a6] text-xs font-semibold uppercase tracking-wider">
              {data?.propertySquareFoot ? `${data.propertySquareFoot.toLocaleString()} sqft` : 'N/A'} | {data?.city || 'London'}
            </p>
            {primaryBadge && (
              <div className="mt-1.5">
                <PropertyBadge badge={primaryBadge} size="xs" />
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h4 className="font-bold text-gray-900 mb-4 text-left text-lg">Contact Agent</h4>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
            className="space-y-4 mb-6"
          >
            <Form.Item name="name" className="mb-0" rules={[{ required: true, message: 'Please enter your name' }]}>
              <Input placeholder="Your Name" size="large" className="bg-gray-50/50 border border-gray-200 rounded-xl hover:border-[#14b8a6] focus:border-[#14b8a6]" />
            </Form.Item>

            <Form.Item name="email" className="mb-0" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
              <Input placeholder="Email Address" size="large" className="bg-gray-50/50 border border-gray-200 rounded-xl hover:border-[#14b8a6] focus:border-[#14b8a6]" />
            </Form.Item>

            <Form.Item name="phone" className="mb-0" rules={[{ required: true, message: 'Please enter your phone number' }]}>
              <Input placeholder="Phone Number" size="large" className="bg-gray-50/50 border border-gray-200 rounded-xl hover:border-[#14b8a6] focus:border-[#14b8a6]" />
            </Form.Item>

            <Form.Item name="message" className="mb-0" rules={[{ required: true }]} >
              <TextArea
                rows={4}
                placeholder='I would like to arrange a viewing for...'
                className="bg-gray-50/50 border border-gray-200 resize-none rounded-xl hover:border-[#14b8a6] focus:border-[#14b8a6]"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-[#14b8a6] hover:!bg-[#119e8e] border-none h-12 font-bold text-base rounded-xl shadow-lg shadow-[#14b8a6]/20"
            >
              Send Message
            </Button>
          </Form>

          {/* Agent Info at bottom */}
          <div className="pt-5 border-t border-gray-100 flex items-center gap-4">
            <div className="relative h-12 w-12 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden">
              <img src={agentImage} alt={data?.agentId?.name || "Agent"} className="rounded-full w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight">{data?.agentId?.name || ''}</h4>
              <p className="text-xs text-gray-500 mb-1">{data?.agentId?.agencyName || 'STA Agency'}</p>
              <a
                href={`tel:${data?.agentId?.phone}`}
                className="text-sm font-bold text-[#14b8a6] flex items-center gap-1 hover:underline"
              >
                <Phone size={12} className="fill-[#14b8a6]/20" />
                {data?.agentId?.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Location card / map placeholder */}
      <div>
        <h4 className="font-bold text-gray-900 mb-2">Location</h4>
        {data?.location?.address && (
          <p className="text-sm text-gray-500 mb-3">{data.location.address}</p>
        )}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm relative h-[200px] cursor-pointer group">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(data?.location?.address || (data?.location?.coordinates ? `${data.location.coordinates[1]},${data.location.coordinates[0]}` : "221B Baker Street, London"))}&z=15&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            className="opacity-90 group-hover:opacity-100 transition-all duration-300"
          />
        </div>
      </div>

      {/* Brochure Section */}
      {data?.brochure && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight">Property Brochure</h4>
              <p className="text-xs text-gray-500 mt-1">Get the full property details, floorplans, and specs in a PDF format.</p>
            </div>
          </div>
          <Button
            icon={<Download size={16} />}
            className="w-full h-11 border-2 border-gray-100 hover:border-[#1a3c6e] hover:text-[#1a3c6e] rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
            onClick={() => window.open(getImage(data.brochure), '_blank')}
          >
            Download Brochure
          </Button>
        </div>
      )}

    </div>
  );
};
