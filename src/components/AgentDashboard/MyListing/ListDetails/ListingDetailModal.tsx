"use client";

import { ListingDetail, formatListingPrice, getListingAddress } from "@/types/listing";
import {
  BankOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  HomeOutlined,
  TagOutlined,
  ThunderboltOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FileImageOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Modal, Skeleton, Tag, Button } from "antd";
import { useState, useEffect } from "react";
import { StatusBadge } from "../ListingsTable";
import { apiFetch, getImage } from "@/lib/api-fech";
import ImageGallery from "./Imagegallery";


interface ListingDetailModalProps {
  listingId: string | null;
  open: boolean;
  onClose: () => void;
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h4>
      {children}
    </div>
  );
}

// ─── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-[#1a3c6e] mt-0.5 flex-shrink-0 opacity-80">{icon}</span>
      <div className="flex items-center justify-between w-full">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
      </div>
    </div>
  );
}

// ─── Skeleton loader ───────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="space-y-5 p-1">
      <Skeleton.Image active className="!w-full !h-56 !rounded-xl" />
      <Skeleton active paragraph={{ rows: 2 }} />
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => <Skeleton.Button key={i} active block className="!h-16 !rounded-xl" />)}
      </div>
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  );
}

function StatTile({ icon, label, value }: any) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-3 px-2 text-center border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
      <span className="text-[#1a3c6e] text-xl mb-1">{icon}</span>
      <span className="text-base font-bold text-gray-900">{value}</span>
      <span className="text-[11px] text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function ListingDetailModal({ listingId, open, onClose }: ListingDetailModalProps) {
  const [detail, setDetail] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !listingId) {
      setDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await apiFetch<{ data: ListingDetail }>(
          `/listings/${listingId}`,
          { method: "GET" },
          "client"
        );
        if (res?.data) {
          setDetail(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch listing detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, listingId]);

  const handleClose = () => {
    setDetail(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={680}
      centered
      destroyOnHidden
      title={
        !loading && detail ? (
          <div className="flex items-center justify-between pr-8">
            <span className="text-lg font-bold text-gray-900 truncate">{detail?.title}</span>
            <StatusBadge status={detail?.status} />
          </div>
        ) : (
          <Skeleton.Input active size="small" className="!w-48" />
        )
      }
      styles={{ body: { padding: "16px 24px 24px", maxHeight: "78vh", overflowY: "auto" } }}
    >
      {loading && < DetailSkeleton />}

      {!loading && detail && (
        <div className="space-y-6">
          {/* Image Gallery */}
          <ImageGallery 
            images={detail.photos?.map(img => getImage(img)) || []} 
            title={detail.title} 
          />

          {/* Price + Address */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-2xl font-bold text-[#1a3c6e]">
                {formatListingPrice(detail)}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <EnvironmentOutlined className="text-[#1a3c6e]" />
                {getListingAddress(detail)}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <EyeOutlined />
                {detail.views?.toLocaleString() ?? 0} views
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs border border-gray-200 bg-gray-50 capitalize">
                {detail.listingType === "SALE" ? "For Sale" : "To Rent"}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <Section title="Property Stats">
            <div className="grid grid-cols-4 gap-2">
              <StatTile icon={<HomeOutlined />} label="Bedrooms" value={detail.propertyBedrooms} />
              <StatTile icon="🛁" label="Bathrooms" value={detail.propertyBathrooms} />
              <StatTile icon="📐" label="Sq Ft" value={detail.propertySquareFoot?.toLocaleString() ?? 0} />
              <StatTile icon="🏷️" label="EPC" value={detail.epcEnergyRating?.label || "N/A"} />
            </div>
          </Section>

          {/* Property Info */}
          <Section title="Property Information">
            <div className="bg-gray-50 rounded-xl px-4 py-1">
              <InfoRow icon={<HomeOutlined />} label="Property Type" value={detail.propertyType} />
              <InfoRow icon={<TagOutlined />} label="Tenure" value={detail.tenure} />
              <InfoRow icon={<BankOutlined />} label="Council Tax Band" value={detail.councilTaxBand} />
              <InfoRow icon={<ThunderboltOutlined />} label="EPC Rating" value={detail.epcEnergyRating?.label || "N/A"} />
              <InfoRow icon={<CalendarOutlined />} label="Listed Date" value={new Date(detail.createdAt).toLocaleDateString()} />
              <InfoRow 
                icon={<UserOutlined />} 
                label="Agent" 
                value={
                  typeof detail.agentId === "object" && detail.agentId !== null
                    ? (detail.agentId as any).name || (detail.agentId as any).agencyName || (detail.agentId as any)._id
                    : detail.agentId
                } 
              />
            </div>
          </Section>

          {/* Features */}
          {detail.features?.length > 0 && (
            <Section title="Key Features">
              <div className="flex flex-wrap gap-2">
                {detail.features.map((f) => (
                  <Tag
                    key={f}
                    className="!bg-blue-50 !text-[#1a3c6e] !border-blue-100 !rounded-full !px-4 !py-1 !text-xs !font-medium"
                  >
                    {f}
                  </Tag>
                ))}
              </div>
            </Section>
          )}

          {/* Videos */}
          {detail.videos && detail.videos.length > 0 && (
            <Section title="Virtual Tours & Videos">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.videos.map((vid, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-gray-150">
                    <video 
                      src={getImage(vid)} 
                      controls
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Floor Plans */}
          {detail.floorPlans && detail.floorPlans.length > 0 && (
            <Section title="Floor Plans">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {detail.floorPlans.map((fp, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group cursor-pointer">
                    <ImageGallery images={[getImage(fp)]} title={`Floor Plan ${idx + 1}`} />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm border-t border-gray-100 text-[10px] font-bold text-[#1a3c6e] text-center">
                      <FileImageOutlined className="mr-1" /> FLOOR PLAN {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Brochures */}
          {detail.brochure && (
            <Section title="Brochures & Documents">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                      <FileTextOutlined className="text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                        Property Brochure.pdf
                      </p>
                      <p className="text-[10px] text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <Button 
                    icon={<DownloadOutlined />} 
                    type="link" 
                    className="text-[#1a3c6e] hover:text-[#14b8a6]"
                    onClick={() => window.open(getImage(detail.brochure!), '_blank')}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </Section>
          )}

          {/* Description */}
          {detail.description && (
            <Section title="Description">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {detail.description}
              </p>
            </Section>
          )}
        </div>
      )}
    </Modal>
  );
}