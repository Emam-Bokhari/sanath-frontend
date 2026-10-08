"use client";

import { useState, useMemo, useEffect, use } from "react";
import { Button, Card, Col, Row, Tag, Table, Skeleton, Modal } from "antd";
import {
  CheckCircleFilled,
  DownloadOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import { apiFetch } from "@/lib/api-fech";
import { isUserLoggedIn } from "@/services/auth.service";
import moment from "moment";
import { invalidateProfileCache } from "../MyListing";

export interface Plan {
  _id: string;
  title: string;
  description: string;
  tier: string;
  status: string;
  duration: "MONTHLY" | "YEARLY";
  pricing: {
    amount: number;
    currency: string;
  };
  limits: {
    maxListings: number;
    loginLimit: number;
  };
  features: {
    leadAccess: boolean;
    featuredListing: boolean;
    verifiedBadge: boolean;
    agentProfilePage: boolean;
  };
  productId: string;
  priceId: string;
  sortOrder: number;
}

export interface Transaction {
  _id: string;
  trxId: string;
  amountPaid: number;
  status: string;
  createdAt: string;
  planId: {
    title: string;
    pricing: {
      currency: string;
    };
  };
}

export interface MySubscription {
  _id: string;
  subscriptionId: string;
  status: string;
  planId: Plan;
  amountPaid: number;
  trxId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

let profilePromiseCache: Promise<any> | null = null;

const getMyProfile = () => {
  if (!profilePromiseCache) {
    profilePromiseCache = apiFetch(
      "/users/profile",
      {
        method: "GET",
      },
      "client",
    );
  }
  return profilePromiseCache;
};

export default function SubscriptionPage({
  plansInfo,
  transactions = [],
  mySubscription = null,
}: {
  plansInfo: Plan[];
  transactions?: Transaction[];
  mySubscription?: MySubscription | null;
}) {
  const router = useRouter();
  const isLoggedIn = isUserLoggedIn();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();

  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let profileResponse: any = null;
  if (isLoggedIn) {
    profileResponse = use(getMyProfile());
  }

  // Consistent with other pages: extract user data from .data
  const profile = profileResponse?.data || profileResponse;
  
  // Combine sources for a more reliable subscription state, especially on reload
  const activeSubscription = mySubscription?.planId || profile?.plan;
  const hasSubscription = mySubscription?.status === "active" || !!profile?.isSubscribed;

  const handleSubscribe = async (plan: Plan) => {
    setIsLoading(true);
    console.log("Subscribing to plan:", plan.title, "Price ID:", plan.priceId);

    try {
      const createCheckoutSession = await apiFetch(
        `/subscriptions/create-checkout-session`,
        {
          method: "POST",
          body: JSON.stringify({
            planId: plan._id,
          }),
        },
        "client",
      );
      if ((createCheckoutSession as any)?.data) {
        setIsLoading(false);
        window.location.href = (createCheckoutSession as any).data;
      } else {
        setIsLoading(false);
        notificationApi.error({
          message: "Failed to create checkout session",
          description: "Please try again later or contact support.",
        });
      }
    } catch (error) {
      setIsLoading(false);
      notificationApi.error({
        message: "Failed to create checkout session",
        description: "Please try again later or contact support.",
      });
    }
  };


  const handleCancelSubscription = () => {
    modal.confirm({
      title: "Cancel Subscription?",
      content: "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.",
      okText: "Yes, Cancel",
      okType: "danger",
      cancelText: "No, Keep it",
      async onOk() {
        try {
          setIsLoading(true);
          await apiFetch("/subscriptions/cancel-subscription", { method: "POST" }, "client");
          notificationApi.success({
            message: "Subscription cancelled successfully",
            description: "Your subscription has been set to cancel at the end of the billing period.",
          });
          invalidateProfileCache();
          router.refresh();
        } catch (error: any) {
          notificationApi.error({
            message: "Failed to cancel subscription",
            description: error?.message || "Please try again later.",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const plans = useMemo(() => {
    const filteredPlans = plansInfo
      .filter((p) => p.duration === (isAnnual ? "YEARLY" : "MONTHLY"))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return filteredPlans.map((p) => ({
      ...p,
      name: p.title,
      price: `${p.pricing.currency === "GBP" ? "£" : "$"}${p.pricing.amount}`,
      period: isAnnual ? "/year" : "/month",
      features: [
        p.limits.maxListings === -1
          ? "Unlimited Active Listings"
          : `Up to ${p.limits.maxListings} Active Listings`,
        p.features.leadAccess && "Full Lead Access",
        p.features.featuredListing && "Featured Listing Placements",
        p.features.verifiedBadge && "Verified Agent Badge",
        p.features.agentProfilePage && "Professional Profile Page",
        `Up to ${p.limits.loginLimit} Agent Logins`,
      ].filter(Boolean) as string[],
      recommended: p.tier === "STARTER" || p.tier === "PRO", // You can adjust recommendation logic
    }));
  }, [plansInfo, isAnnual]);

  const invoiceColumns = [
    {
      title: "Transaction ID",
      dataIndex: "trxId",
      key: "trxId",
      className: "font-medium",
      render: (trxId: string) => <span className="text-xs">{trxId || "N/A"}</span>,
    },
    {
      title: "Plan",
      dataIndex: ["planId", "title"],
      key: "plan",
      className: "text-gray-500",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      className: "text-gray-500",
      render: (date: string) => moment(date).format("MMM DD, YYYY"),
    },
    {
      title: "Amount",
      key: "amount",
      className: "font-semibold text-gray-900",
      render: (_: any, record: Transaction) => {
        const currency = record.planId?.pricing?.currency === "GBP" ? "£" : "$";
        return `${currency}${record.amountPaid || 0}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "active" || status === "succeeded" ? "green" : "orange"}
          className="rounded-full px-3 capitalize"
        >
          {status}
        </Tag>
      ),
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: () => (
    //     <Button
    //       type="link"
    //       icon={<DownloadOutlined />}
    //       className="text-[#1a3c6e] font-medium"
    //     >
    //       Receipt
    //     </Button>
    //   ),
    // },
  ];
  return (
    <div className="max-w-7xl mx-auto">
      {notificationContextHolder}
      {modalContextHolder}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1a3c6e]">
          Billing & Subscription
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your plan, billing details, and view invoices.
        </p>
      </div>

      {hasSubscription ? (
        /* ─── ACTIVE SUBSCRIPTION VIEW ─── */
        <div className="space-y-8 animate-in fade-in duration-500">
          <Card
            className="rounded-2xl border-gray-200 shadow-sm overflow-hidden"
            styles={{ body: { padding: 0 } }}
          >
            <div className="bg-[#1a3c6e] p-8 text-white">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold m-0">
                      {activeSubscription?.title || "Active Plan"}
                    </h2>
                    <Tag
                      color="green"
                      className="border-none bg-green-500/20 text-green-100 uppercase tracking-wider font-bold rounded-full px-3 m-0"
                    >
                      Active
                    </Tag>
                  </div>
                  <p className="text-blue-100 opacity-90 max-w-md m-0">
                    Your subscription is currently active. Next billing date:{" "}
                    {mySubscription?.currentPeriodEnd ? moment(mySubscription.currentPeriodEnd).format("MMM DD, YYYY") : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold m-0">
                    {activeSubscription?.pricing?.currency === "GBP" ? "£" : "$"}{activeSubscription?.pricing?.amount || "0"}
                    <span className="text-lg font-normal text-blue-100">
                      /{activeSubscription?.duration === "YEARLY" ? "yr" : "mo"}
                    </span>
                  </p>
                  <p className="text-sm text-blue-100 mt-1 m-0">
                    Subscription ID: {mySubscription?.subscriptionId || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">
                Plan Limits
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">
                      Listings Allowance
                    </span>
                    <span className="font-bold text-gray-900">
                      {activeSubscription?.limits?.maxListings === -1 ? "Unlimited" : `${activeSubscription?.limits?.maxListings || 0} Listings`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  danger
                  type="primary"
                  onClick={handleCancelSubscription}
                  className="!h-10 !px-6 !font-semibold !rounded-md shadow-sm"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </Card>

          {/* Billing History */}
          {transactions.length > 0 && (
            <Card
              className="rounded-2xl border-gray-200 shadow-sm mt-6!"
              title={
                <span className="font-bold text-gray-800">Billing History</span>
              }
            >
              <Table
                dataSource={transactions}
                columns={invoiceColumns}
                pagination={false}
                rowKey="_id"
                className="border border-gray-100 rounded-xl overflow-hidden"
              />
            </Card>
          )}
        </div>
      ) : (
        /* ─── NO SUBSCRIPTION VIEW (PLANS GRID) ─── */
        <div className="animate-in fade-in duration-500">
          <div className="animate-in slide-in-from-top-4 fade-in duration-700">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Choose the perfect plan for your business
              </h2>
              <p className="text-gray-500 mb-6">
                Upgrade to unlock more listings, featured placements, and
                advanced tools to grow your real estate reach.
              </p>

              <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${!isAnnual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-5 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${isAnnual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Annually{" "}
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl border bg-white p-6 transition-all duration-300 hover:shadow-lg flex flex-col ${plan.recommended ? "border-[#1a3c6e] shadow-md transform md:-translate-y-2 ring-1 ring-[#1a3c6e]/10" : "border-gray-200"}`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a3c6e] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 font-medium mb-1">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircleFilled
                          className={`mt-0.5 ${plan.recommended ? "text-[#1a3c6e]" : "text-gray-400"}`}
                        />
                        <span className="text-gray-600 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    type={plan.recommended ? "primary" : "default"}
                    block
                    onClick={() => handleSubscribe(plan as any)}
                    loading={isLoading}
                    className={`!h-12 !font-bold !text-base !rounded-lg shadow-sm ${plan.recommended ? "!bg-[#1a3c6e] !border-[#1a3c6e] hover:!bg-[#0f2d5e]" : "hover:!border-[#1a3c6e] hover:!text-[#1a3c6e]"}`}
                  >
                    Subscribe Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
