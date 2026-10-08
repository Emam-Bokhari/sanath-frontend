"use client";

import { useState } from "react";
import { Button, message, notification } from "antd";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProfilePhotoUpload from "@/components/UserDashboard/ProfileInfo/ProfilePhotoUpload";
import PersonalInfoForm from "@/components/UserDashboard/ProfileInfo/PersonalInfoForm";
import AddressForm from "@/components/UserDashboard/ProfileInfo/AddressForm";
import type { ProfileFormData } from "@/types/account";
import { apiFetch } from "@/lib/api-fech";
import { revalidateCacheTag } from "@/helpers/revalidateHelper";
import { invalidateProfileCache } from "@/components/layout/NavActions";

export default function AccountSettingsPage({ profile }: { profile: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [notificationApi, contextHolder] = notification.useNotification();
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    // Track the form inputs in local state to make them fully editable and interactive
    const [profileState, setProfileState] = useState<ProfileFormData>({
        fullName: profile?.name || "",
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
            // Build the stringified JSON payload for non-file text fields
            const payload = {
                name: profileState.fullName,
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

            // Call the PATCH endpoint with the FormData
            await apiFetch('/users', {
                method: 'PATCH',
                body: formData,
            }, 'client');

            notificationApi.success({
                message: "Profile updated successfully",
                placement: "topRight",
            });
            invalidateProfileCache();
            router.refresh();
        } catch (err: any) {
            console.error("AccountSettingsPage error:", err);
            notificationApi.error({
                message: err?.message || "Unexpected error occurred",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
            router.refresh();
        }
    };

    return (
        <div className="max-w-4xl">
            {contextHolder}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#1a3c6e]">Profile</h1>
                <p className="text-gray-500 mt-1">Manage your personal details and account information.</p>
            </div>

            <form onSubmit={handleSave}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in duration-500">
                    <ProfilePhotoUpload 
                        profilePhoto={profile?.profileImage} 
                        onChange={(file) => setProfileImageFile(file)}
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

                    <div className="pt-4 flex justify-end">
                        <Button
                            htmlType="submit"
                            type="primary"
                            size="large"
                            loading={loading}
                            className="!bg-[#1a3c6e] !border-[#1a3c6e] !h-12 !rounded-xl !px-12 font-bold text-base shadow-lg shadow-[#1a3c6e]/20 hover:!scale-[1.02] active:!scale-95 transition-all"
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
