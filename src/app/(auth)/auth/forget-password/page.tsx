import ForgetPassword from "@/components/auth/ForgetPass";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgetPassword />
    </Suspense>
  );
};

export default page;
