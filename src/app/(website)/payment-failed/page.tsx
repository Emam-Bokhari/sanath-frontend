import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "antd";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-center">
          <div className="bg-red-50 p-4 rounded-full">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-500">
            We're sorry, but your transaction could not be completed. Please check your payment details and try again.
          </p>
        </div>

        <div className="pt-4! space-y-3!">
          <Link href="/agent-dashboard/subscription">
            <Button 
              type="primary" 
              size="large" 
              className="w-full h-12 !bg-[#1a3c6e] !border-[#1a3c6e] !rounded-lg font-semibold text-lg"
            >
              Try Again
            </Button>
          </Link>
          
          <Link href="/">
            <Button 
              size="large" 
              className="w-full mt-4! h-12 !rounded-lg font-medium text-gray-600 border-gray-200 hover:border-gray-300"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
