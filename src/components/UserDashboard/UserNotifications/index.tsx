"use client";

import React, { useEffect, useState } from 'react';
import { Switch, Pagination, Empty, Button, Tooltip } from 'antd';
import {
  Bell,
  Clock,
  ArrowRight,
  Mail,
  Smartphone,
  Home,
  AlertCircle,
  Settings,
  CheckCheck,
} from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { apiFetch } from '@/lib/api-fech';
import { toast } from 'sonner';
import { getUserInfo } from '@/services/auth.service';

dayjs.extend(relativeTime);

export interface NotificationPreference {
  _id: string;
  userId: string;
  email: boolean;
  push: boolean;
  socket: boolean;
  enquiryAssigned: boolean;
  enquiryCreated: boolean;
  enquiryReplied: boolean;
  listingApproved: boolean;
  listingRejected: boolean;
  userSignup: boolean;
  subscription: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  text: string;
  receiver: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  referenceId: any;
  referenceModel: string;
  read: boolean;
  type: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  unreadCount: number;
}

const CHANNEL_SETTINGS = [
  {
    key: 'email',
    icon: <Mail size={20} className="text-[#1a3c6e]" />,
    title: 'Email Alerts',
    description: 'Receive alerts via email',
    roles: ['AGENT', 'USER'],
  },
  {
    key: 'push',
    icon: <Smartphone size={20} className="text-[#1a3c6e]" />,
    title: 'Push Notifications',
    description: 'Get instant updates on your device',
    roles: ['AGENT', 'USER'],
  },
];

const ALERT_TYPE_SETTINGS = [
  {
    key: 'listingApproved',
    icon: <Home size={20} className="text-[#1a3c6e]" />,
    title: 'Listing approved',
    description: 'When your listing goes live',
    roles: ['AGENT'],
  },
  {
    key: 'listingRejected',
    icon: <AlertCircle size={20} className="text-[#1a3c6e]" />,
    title: 'Listing rejected',
    description: 'When your listing is rejected',
    roles: ['AGENT'],
  },
  {
    key: 'enquiryCreated',
    icon: <Mail size={20} className="text-[#1a3c6e]" />,
    title: 'Enquiry created',
    description: 'When a new enquiry is made',
    roles: ['AGENT'],
  },
  {
    key: 'subscription',
    icon: <CheckCheck size={20} className="text-[#1a3c6e]" />,
    title: 'Subscription',
    description: 'Updates about your subscription',
    roles: ['AGENT', 'ADMIN'],
  },
  {
    key: 'enquiryReplied',
    icon: <CheckCheck size={20} className="text-[#1a3c6e]" />,
    title: 'Enquiry replied',
    description: 'When an enquiry is replied',
    roles: ['USER'],
  },
];

const ToggleRow = ({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <Switch
      checked={checked}
      onChange={onChange}
      style={{ backgroundColor: checked ? '#1a3c6e' : undefined }}
    />
  </div>
);

const NotificationSettings = ({ 
  onBack, 
  initialPreferences 
}: { 
  onBack: () => void; 
  initialPreferences?: NotificationPreference | null;
}) => {
  const user = getUserInfo() as any;
  const userRole = user?.role || 'USER';

  const [preferences, setPreferences] = useState<NotificationPreference | null>(initialPreferences || null);
  const [loading, setLoading] = useState(!initialPreferences);

  useEffect(() => {
    if (initialPreferences) return;
    
    const fetchPreferences = async () => {
      try {
        const res = await apiFetch<any>('/notification-preferences', { method: 'GET' }, 'client');
        if (res?.data) {
          setPreferences(res.data);
        }
      } catch (err) {
        console.error('Fetch preferences error:', err);
        toast.error('Failed to load notification settings');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [initialPreferences]);

  const handleToggle = async (key: string, value: boolean) => {
    if (!preferences) return;

    // Optimistic update
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);

    try {
      await apiFetch("/notification-preferences", {
        method: 'PATCH',
        body: JSON.stringify({ [key]: value }),
      }, 'client');
      toast.success('Preference updated');
    } catch (err) {
      console.error('Update preference error:', err);
      toast.error('Failed to update preference');
      // Rollback
      setPreferences(preferences);
    }
  };

  const filteredChannels = CHANNEL_SETTINGS.filter(setting => setting.roles.includes(userRole));
  const filteredAlerts = ALERT_TYPE_SETTINGS.filter(setting => setting.roles.includes(userRole));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a3c6e]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowRight className="rotate-180 text-[#1a3c6e]" size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a3c6e]">Notification Settings</h1>
          <p className="text-gray-500 mt-1">Manage how you receive updates</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
        {filteredChannels.length > 0 && (
          <div className="px-5 divide-y divide-gray-100">
            {filteredChannels.map(row => (
              <ToggleRow
                key={row.key}
                icon={row.icon}
                title={row.title}
                description={row.description}
                checked={preferences ? (preferences[row.key as keyof NotificationPreference] as boolean) : false}
                onChange={v => handleToggle(row.key, v)}
              />
            ))}
          </div>
        )}

        {filteredAlerts.length > 0 && (
          <>
            <div className="px-5 pt-5 pb-1 border-t border-gray-100">
              <p className="text-sm font-extrabold text-gray-900">Alert Types</p>
            </div>
            <div className="px-5 divide-y divide-gray-100">
              {filteredAlerts.map(row => (
                <ToggleRow
                  key={row.key}
                  icon={row.icon}
                  title={row.title}
                  description={row.description}
                  checked={preferences ? (preferences[row.key as keyof NotificationPreference] as boolean) : false}
                  onChange={v => handleToggle(row.key, v)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const UserNotifications = ({ 
  notifications = [], 
  meta,
  notificationPreferences
}: { 
  notifications?: Notification[]; 
  meta?: NotificationMeta;
  notificationPreferences?: NotificationPreference | null;
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleMarkAsRead = async (item: Notification) => {

    try {
      await apiFetch(`/notifications/${item?._id}`, { method: 'PATCH' }, 'client');
        if(!!item?.referenceId?.status){
          router.push(`/agent-dashboard/agent-enquiries?page=1&status=${item?.referenceId?.status}`)
        }

    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  if (showSettings) {
    return (
      <div className="max-w-7xl">
        <NotificationSettings 
          onBack={() => setShowSettings(false)} 
          initialPreferences={notificationPreferences}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a3c6e]">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with your property activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip title="Notification settings">
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-xl cursor-pointer bg-white border border-gray-100 shadow-sm hover:bg-gray-50 flex items-center justify-center transition-all"
            >
              <Settings size={18} className="text-[#1a3c6e]" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {notifications.length > 0 ? (
          notifications.map(item => (
            <div
              key={item._id}
              onClick={() => handleMarkAsRead(item)}
              className={`group relative flex gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                !item.read
                  ? 'bg-white border-blue-100 shadow-sm ring-1 ring-blue-50'
                  : 'bg-gray-50/30 border-gray-100 opacity-80'
              }`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                !item.read ? 'bg-blue-50 text-[#1a3c6e]' : 'bg-gray-100 text-gray-400'
              }`}>
                {item.referenceModel === 'Enquery' ? <Mail size={22} /> : <Bell size={22} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-bold truncate ${!item.read ? 'text-gray-900' : 'text-gray-600'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1 ml-2 shrink-0">
                    <Clock size={12} />
                    {dayjs(item.createdAt).fromNow()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.text}</p>
              </div>

              <div className="flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-[#1a3c6e]" size={18} />
              </div>

              {!item.read && (
                <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-4 ring-blue-50" />
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-center">
            <Empty description="No notifications yet" />
          </div>
        )}
      </div>

      {meta && meta.total > meta.limit && (
        <div className="flex justify-center pt-4">
          <Pagination
            current={meta.page}
            total={meta.total}
            pageSize={meta.limit}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="custom-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
