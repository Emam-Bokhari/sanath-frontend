"use client";

import { useEffect, useState } from "react";
import { Modal, Button, Progress, Skeleton, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  canShowSaveDraftButton,
  LISTING_STATUS,
  ListingDetail,
  ListingFormData,
  listingToFormData,
  shouldPreserveListingStatus,
} from "@/types/listing";

import Step1Basics from "./Step1Basics";
import Step2Media from "./Step2Media";
import Step3Details from "./Step3Details";
import Step4Features from "./Step4Features";
import Step5Review from "./Step5Review";
import { apiFetch } from "@/lib/api-fech";
const TOTAL_STEPS = 5;

const DEFAULT_FORM: ListingFormData = {
  listingType: "for-sale",
  title: "",
  price: "",
  postcode: "",
  country: "United Kingdom",
  city: "",
  streetAddress: "",
  coordinates: [0, 0],
  photos: [],
  videos: [],
  floorPlan: [],
  brochures: [],
  threeSixtyTour: [],
  existingPhotos: [],
  existingVideos: [],
  existingFloorPlan: [],
  existingBrochures: [],
  existingThreeSixtyTour: [],
  propertyType: "",
  beds: "",
  baths: "",
  sqFt: "",
  tenure: "",
  councilTaxBand: "",
  epc: "",
  features: [],
  description: "",
  publishStatus: "Active",
  apiStatus: LISTING_STATUS.DRAFT,
};

export interface ListingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** Pass a listingId to enter Edit mode; omit for Add mode */
  editId?: string | null;
}

export default function ListingModal({ open, onClose, onSuccess, editId }: ListingModalProps) {
  const isEditMode = !!editId;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>(DEFAULT_FORM);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submittingDraft, setSubmittingDraft] = useState(false);
  const [submittingActive, setSubmittingActive] = useState(false);
 const [notificationApi, notificationContextHolder] = notification.useNotification();
  // ── Fetch existing data when opening in edit mode ──────────────────────────
  useEffect(() => {
    if (!open) return;

    if (!isEditMode) {
      setFormData(DEFAULT_FORM);
      setStep(1);
      return;
    }

    const fetchExisting = async () => {
      setLoadingDetail(true);
      try {
        const response = await apiFetch<{ data: ListingDetail }>(`/listings/${editId}`, { method: "GET" }, "client");

        if (response?.data) {
          setFormData(listingToFormData(response.data));
          setStep(1);
        } else {
          notificationApi.error({
            message: "Could not find listing details",
            description: "Please check the listing ID and try again.",
            placement: "topRight",
          });
          onClose();
        }
      } catch (err) {
        notificationApi.error({
          message: "Unexpected error occurred",
          description: "Please try again later.",
          placement: "topRight",
        });
        onClose();
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchExisting();
  }, [open, editId]);

  const updateForm = (updates: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleClose = () => {
    setStep(1);
    setFormData(DEFAULT_FORM);
    onClose();
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else handleClose();
  };

  const handleContinue = () => {
    if (step === 2) {
      const photoCount = formData.photos.length + formData.existingPhotos.length;
      if (photoCount < 1) {
        notificationApi.error({
          message: "Please select at least 1 photo of the property.",
          placement: "topRight",
        });
        return;
      }
    }
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  // ── Submit handlers ────────────────────────────────────────────────────────
  const handleSubmitListing = async (publishStatus: "Active" | "Draft") => {
    const photoCount = formData.photos.length + formData.existingPhotos.length;
    if (photoCount < 1) {
      notificationApi.error({
        message: "Please select at least 1 photo of the property.",
        placement: "topRight",
      });
      setStep(2);
      return;
    }

    if (publishStatus === "Active") setSubmittingActive(true);
    else setSubmittingDraft(true);

    try {
      // Helper to sanitize numeric strings (remove commas, spaces, etc.)
      const sanitizeNum = (val: string | number) => {
        if (typeof val === 'number') return val;
        const cleaned = val.replace(/[^0-9.]/g, '');
        return cleaned ? Number(cleaned) : 0;
      };

      const preserveStatus =
        isEditMode && shouldPreserveListingStatus(formData.apiStatus);

      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        askingPrice: sanitizeNum(formData.price),
        country: formData.country,
        city: formData.city,
        postalCode: formData.postcode,
        listingType: formData.listingType === "to-rent" ? "RENT" : "SALE",
        features: formData.features,
        location: {
          type: "Point",
          coordinates: formData.coordinates,
          address: formData.streetAddress,
        },
        propertyType: formData.propertyType,
        propertyBedrooms: sanitizeNum(formData.beds),
        propertyBathrooms: sanitizeNum(formData.baths),
        propertySquareFoot: sanitizeNum(formData.sqFt),
        tenure: formData.tenure,
        councilTaxBand: formData.councilTaxBand,
        epcEnergyRating: {
          label: formData.epc,
          score: 92,
        },
      };

      if (!preserveStatus) {
        payload.status =
          publishStatus === "Active"
            ? LISTING_STATUS.PENDING_APPROVAL
            : LISTING_STATUS.DRAFT;
      }

      const body = new FormData();
      body.append("data", JSON.stringify(payload));

      // Append new files
      formData.photos.forEach((file) => body.append("photos", file));
      formData.videos.forEach((file) => body.append("videos", file));
      formData.floorPlan.forEach((file) => body.append("floorPlans", file));
      if (formData.brochures[0]) {
        body.append("brochure", formData.brochures[0]);
      }
      if (formData.threeSixtyTour[0]) {
        body.append("threeSixtyTour", formData.threeSixtyTour[0]);
      }

      // Important: Ensure the endpoint is correct for updates. 
      // Usually /listings/:id for PATCH, not /listings/my/:id
      const endpoint = isEditMode ? `/listings/my/${editId}` : "/listings";
      const method = isEditMode ? "PATCH" : "POST";

      // Improved logging to see FormData content in browser console
      console.log("=== Listing Submission Payload ===");
      console.log("JSON Data:", payload);
      console.log("FormData Files:");
      body.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`- ${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`- ${key}: [JSON String]`);
        }
      });

      await apiFetch(endpoint, {
        method,
        body,
      }, "client");

      notificationApi.success({
        message: isEditMode ? "Listing updated successfully!" : "Property published successfully!",
        placement: "topRight",
      });
      handleClose();
      onSuccess();
    } catch (err: any) {
      notificationApi.error({
        message: err.message || "Unexpected error occurred",
        placement: "topRight",
      });
    } finally {
      setSubmittingActive(false);
      setSubmittingDraft(false);
    }
  };

  const handleSaveDraft = () => handleSubmitListing("Draft");
  const handlePublish = () => handleSubmitListing("Active");

  // ── Render ─────────────────────────────────────────────────────────────────
  const progressPercent = Math.round((step / TOTAL_STEPS) * 100);
  
  const stepLabels = [
    "Basics",
    "Media",
    "Details",
    "Features",
    "Review"
  ];

  const renderStep = () => {
    if (loadingDetail) {
      return (
        <div className="space-y-4 py-4">
          <Skeleton active paragraph={{ rows: 3 }} />
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      );
    }
    switch (step) {
      case 1: return <Step1Basics data={formData} onChange={updateForm} />;
      case 2: return <Step2Media data={formData} onChange={updateForm} />;
      case 3: return <Step3Details data={formData} onChange={updateForm} />;
      case 4: return <Step4Features data={formData} onChange={updateForm} />;
      case 5: return <Step5Review data={formData} onChange={updateForm} />;
      default: return null;
    }
  };

  const renderFooter = () => {
    if (loadingDetail) return null;

    const isSubmitting = submittingActive || submittingDraft;

    const showSaveDraft = canShowSaveDraftButton(formData.apiStatus);

    if (step === TOTAL_STEPS) {
      return (
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Button size="large" onClick={handleBack} disabled={isSubmitting}>Back</Button>
          <div className="flex gap-2">
            {showSaveDraft && (
              <Button size="large" onClick={handleSaveDraft} loading={submittingDraft} disabled={submittingActive}>
                Save Draft
              </Button>
            )}
            <Button
              size="large"
              type="primary"
              onClick={handlePublish}
              loading={submittingActive}
              disabled={submittingDraft}
              style={{ backgroundColor: "#1a3c6e", borderColor: "#1a3c6e" }}
            >
              {isEditMode ? "Update Listing" : "Publish Property"}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        {step > 1
          ? <Button size="large" onClick={handleBack} disabled={isSubmitting}>Back</Button>
          : <div />
        }
        <Button
          size="large"
          type="primary"
          onClick={handleContinue}
          disabled={loadingDetail}
          style={{ backgroundColor: "#1a3c6e", borderColor: "#1a3c6e" }}
        >
          Continue
        </Button>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={740}
      centered
      destroyOnHidden
      styles={{ body: { padding: "28px 32px 0" } }}
    >
      {notificationContextHolder}
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={handleClose}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
        >
          <ArrowLeftOutlined className="text-xs" />
          Back to Listings
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Property" : "Add New Property"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-[#1a3c6e] bg-blue-50 px-2 py-0.5 rounded-md">
                Step {step}: {stepLabels[step - 1]}
              </span>
              <span className="text-xs text-gray-400">
                of {TOTAL_STEPS}
              </span>
            </div>
          </div>
          {isEditMode && (
            <span className="text-xs bg-amber-50 border border-amber-200 text-amber-600 px-3 py-1 rounded-full font-medium shadow-sm">
              Editing Mode
            </span>
          )}
        </div>

        <div className="mt-6 mb-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Listing Completion
            </span>
            <span className="text-sm font-black text-[#1a3c6e]">
              {loadingDetail ? 0 : progressPercent}%
            </span>
          </div>
          <Progress
            percent={loadingDetail ? 0 : progressPercent}
            showInfo={false}
            strokeColor={{
              '0%': '#1a3c6e',
              '100%': '#2563eb',
            }}
            trailColor="#f1f5f9"
            strokeWidth={10}
            className="m-0 !rounded-full overflow-hidden"
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[320px] pb-4">{renderStep()}</div>

      {/* Footer */}
      <div className="pb-4">{renderFooter()}</div>
    </Modal>
  );
}