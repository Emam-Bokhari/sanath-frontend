import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "antd";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-center">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-500">
            Thank you for your payment. Your transaction has been completed successfully and your account has been updated.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/agent-dashboard/subscription">
            <Button 
              type="primary" 
              size="large" 
              className="w-full h-12 !bg-[#1a3c6e] !border-[#1a3c6e] !rounded-lg font-semibold text-lg"
            >
            View Subscription Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
