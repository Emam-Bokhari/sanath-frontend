"use client";

import { useState } from "react";
import { Button, notification, Tabs } from "antd";
import { useRouter } from "next/navigation";
import { User, Building2 } from "lucide-react";
import ProfilePhotoUpload from "@/components/UserDashboard/ProfileInfo/ProfilePhotoUpload";
import PersonalInfoForm from "@/components/UserDashboard/ProfileInfo/PersonalInfoForm";
import AddressForm from "@/components/UserDashboard/ProfileInfo/AddressForm";
import { apiFetch } from "@/lib/api-fech";
import { invalidateProfileCache } from "@/components/layout/NavActions";

export default function AgencyProfilePage({
  profile,
  feeds,
}: {
  profile: any;
  feeds: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [agencyLogoFile, setAgencyLogoFile] = useState<File | null>(null);
  const [xmlFeedUrl, setXmlFeedUrl] = useState(feeds.xmlFeedUrl || "");
  const [blmFeedUrl, setBlmFeedUrl] = useState(feeds.blmFeedUrl || "");
  const [feedType, setFeedType] = useState(feeds.feedType || "");

  // Track the form inputs in local state
  const [profileState, setProfileState] = useState({
    fullName: profile?.name || "",
    agencyName: profile?.agencyName || "",
    email: profile?.email || "",
    city: profile?.city || "",
    phone: profile?.phone || "",
    addressLine: profile?.location?.address || "",
    postalCode: profile?.postalCode || "",
    country: profile?.country || "",
    dateOfBirth: profile?.dateOfBirth || "",
  });

  const handleChange = (field: string, value: any) => {
    setProfileState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save Profile
      const payload = {
        name: profileState.fullName,
        agencyName: profileState.agencyName,
        phone: profileState.phone,
        email: profileState.email,
        postalCode: profileState.postalCode,
        city: profileState.city,
        country: profileState.country,
        location: {
          address: profileState.addressLine,
        },
        dateOfBirth: profileState.dateOfBirth,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      // Profile Image
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      // Agency Logo
      if (agencyLogoFile) {
        formData.append("agencyLogo", agencyLogoFile);
      }

      await apiFetch(
        "/users",
        {
          method: "PATCH",
          body: formData,
        },
        "client",
      );

      // Save Feed Settings
      await apiFetch(
        "/agent-feeds",
        {
          method: "POST",
          body: JSON.stringify({
            ...feeds,
            xmlFeedUrl: xmlFeedUrl || "",
            blmFeedUrl: blmFeedUrl || "",
            feedType: feedType || "",
          }),
        },
        "client",
      );

      notificationApi.success({
        message: "Profile updated successfully",
        placement: "topRight",
      });
      invalidateProfileCache();
      router.refresh();
    } catch (err: any) {
      console.error("AgencyProfilePage error:", err);
      notificationApi.error({
        message: err?.message || "Unexpected error occurred",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "personal",
      label: (
        <div className="flex items-center gap-2 px-1">
          <User size={16} />
          <span>Personal Profile</span>
        </div>
      ),
      children: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ProfilePhotoUpload
            profilePhoto={profile?.profileImage}
            onChange={(file) => setProfileImageFile(file)}
            title="Personal Photo"
          />
          <PersonalInfoForm
            data={{
              fullName: profileState.fullName,
              email: profileState.email,
              phone: profileState.phone,
              dateOfBirth: profileState.dateOfBirth,
            }}
            onChange={handleChange}
          />
          <hr className="border-gray-100" />
          <AddressForm
            data={{
              addressLine: profileState.addressLine,
              city: profileState.city,
              postalCode: profileState.postalCode,
              country: profileState.country,
            }}
            onChange={handleChange}
          />
        </div>
      ),
    },
    {
      key: "agency",
      label: (
        <div className="flex items-center gap-2 px-1">
          <Building2 size={16} />
          <span>Agency Profile</span>
        </div>
      ),
      children: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ProfilePhotoUpload
            profilePhoto={profile?.agencyLogo}
            onChange={(file) => setAgencyLogoFile(file)}
            title="Agency Logo"
          />

          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              Agency Information
            </h3>
            <div className="max-w-xl">
              <label className="block text-[14px] font-semibold text-slate-700 mb-2">
                Agency Name
              </label>
              <input
                type="text"
                value={profileState.agencyName}
                onChange={(e) => handleChange("agencyName", e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/20 transition-all"
                placeholder="Enter agency name"
              />
            </div>
            <div className="max-w-xl">
              <label className="block text-[14px] font-semibold text-slate-700 mb-2">
                Feed Type
              </label>
              <select
                value={feedType}
                onChange={(e) => setFeedType(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/20 transition-all bg-white"
              >
                <option value="">Select feed type</option>
                <option value="XML">XML</option>
                <option value="BLM">BLM</option>
                <option value="BOTH">BOTH</option>
              </select>
            </div>
            <div className="max-w-xl">
              <label className="block text-[14px] font-semibold text-slate-700 mb-2">
                XML Feed Link
              </label>
              <input
                type="text"
                value={xmlFeedUrl}
                onChange={(e) => setXmlFeedUrl(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/20 transition-all"
                placeholder="Enter your xml feed link"
              />
            </div>
            <div className="max-w-xl">
              <label className="block text-[14px] font-semibold text-slate-700 mb-2">
                BLM Feed Link
              </label>
              <input
                type="text"
                value={blmFeedUrl}
                onChange={(e) => setBlmFeedUrl(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/20 transition-all"
                placeholder="Enter your BLM feed link"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  console.log("feeds", feeds);

  return (
    <div className="max-w-4xl">
      {contextHolder}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1a3c6e]">
          Profile Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your personal and agency details.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 sm:p-4">
          <Tabs
            defaultActiveKey="personal"
            items={tabItems}
            className="custom-agency-tabs"
            size="large"
            tabBarStyle={{
              marginBottom: 24,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          />

          <div className="p-4 sm:p-6 pt-0 flex justify-end">
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={loading}
              className="!bg-[#1a3c6e] !border-[#1a3c6e] !h-12 !rounded-xl !px-12 font-bold text-base shadow-lg shadow-[#1a3c6e]/20 hover:!scale-[1.02] active:!scale-95 transition-all"
            >
              Save All Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
