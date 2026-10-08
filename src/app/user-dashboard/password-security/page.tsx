import ChangePasswordForm from "@/components/UserDashboard/PasswordAndSecurity/ChangePasswordForm";
import DeleteAccountSection from "@/components/UserDashboard/PasswordAndSecurity/DeleteAccountSection";

export default function ChangePasswordPage() {
    return (
        <div className="max-w-7xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a3c6e] mb-1">Password & Security</h1>
                <p className="text-gray-500 text-sm">Manage your password and account security settings.</p>
            </div>
            <div className="space-y-7 max-w-3xl">
                <ChangePasswordForm />
                <hr className="border-gray-100" />
                <DeleteAccountSection />
            </div>
        </div>
    );
}