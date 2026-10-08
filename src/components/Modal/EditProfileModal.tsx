"use client";

import React, { useState } from "react";
import { Modal, Input, Button, Select, DatePicker, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload";
import moment from "moment"; // Import moment
import { init } from "next/dist/compiled/webpack/webpack";

const { Option } = Select;

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    userName?: string;
    contactNumber?: string;
    squareNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    userName: initialData.userName || "",
    contactNumber: initialData.contactNumber || "",
    squareNumber: initialData.squareNumber || "",
    dateOfBirth: initialData.dateOfBirth || "",
    gender: initialData.gender || "Male",
    address: initialData.address || "",
    profilePicture: null,
  });
  //   console.log(initialData);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (
    date: moment.Moment | null,
    dateString: string | string[]
  ) => {
    const dateStr = Array.isArray(dateString) ? dateString[0] : dateString;
    setFormData((prev) => ({ ...prev, dateOfBirth: dateStr || "" }));
  };

  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      setFormData((prev) => ({
        ...prev,
        profilePicture: info.file.originFileObj,
      }));
    }
    setFormData({
      userName: initialData.userName || "",
      contactNumber: initialData.contactNumber || "",
      squareNumber: initialData.squareNumber || "",
      dateOfBirth: initialData.dateOfBirth || "",
      gender: initialData.gender || "Male",
      address: initialData.address || "",
      profilePicture: null,
    });
  };

  const uploadProps: UploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange: handleUpload,
    showUploadList: false,
  };

  const handleSave = () => {
    onSave(formData);
    setFormData({
      userName: "",
      contactNumber: "",
      squareNumber: "",
      dateOfBirth: "",
      gender: "Male",
      address: "",
      profilePicture: null,
    });
    onClose();
  };

  // Convert dateOfBirth to moment object, or null if invalid
  const dateValue = formData.dateOfBirth
    ? moment(formData.dateOfBirth, "YYYY-MM-DD", true)
    : null;

  return (
    <>
      <Modal
        title="Edit Profile"
        open={visible}
        onCancel={onClose}
        width={600}
        footer={null}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
            {/* <div
              style={{ marginTop: "10px", fontSize: "24px", color: "#1890ff" }}
            >
              {initialData?.name || "M"}
            </div> */}
          </div>
          <div
            style={{
              display: "grid",
              gap: "15px",
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            <div>
              <label>Name</label>
              <Input
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label>Date of birth</label>
              <DatePicker
                value={dateValue} // Use moment object or null
                onChange={handleDateChange}
                style={{ width: "100%" }}
                placeholder="Enter date of birth"
                format="YYYY-MM-DD" // Ensure date format matches your input
              />
            </div>
            <div>
              <label>Contact Number</label>
              <Input
                inputMode="numeric"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                placeholder="Enter contact number"
              />
            </div>
            <div>
              <label>Gender</label>
              <Select
                value={formData.gender}
                onChange={(value) => handleChange("gender", value)}
                style={{ width: "100%" }}
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </div>
            <div>
              <label>Address</label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Netherlands"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Button
              key="save"
              type="primary"
              style={{
                background: "#6DBD44",
                borderColor: "#6DBD44",
                marginTop: "20px",
              }}
              onClick={handleSave}
            >
              Save & Change
            </Button>
          </div>
          ,
        </div>
      </Modal>
    </>
  );
};

export default EditProfileModal;
