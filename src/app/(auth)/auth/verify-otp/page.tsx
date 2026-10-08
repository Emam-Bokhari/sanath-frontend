import VerifyOtp from "@/components/auth/VerifyOtp/VerifyOtp";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtp />
    </Suspense>
  );
};

export default page;
