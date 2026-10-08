"use client";

import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { toast } from "sonner";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Add manual validation if needed
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all password fields!");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    onSave(formData);
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    onClose();
  };

  return (
    <Modal
      title="Change Password"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
        }}
      >
        <div style={{ display: "grid", gap: "15px" }}>
          <div>
            <label>Old Password</label>
            <Input.Password
              required
              value={formData.oldPassword}
              onChange={(e) => handleChange("oldPassword", e.target.value)}
              placeholder="Old Password"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </div>
          <div>
            <label>New Password</label>
            <Input.Password
              required
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              placeholder="New Password"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </div>
          <div>
            <label>Confirm new Password</label>
            <Input.Password
              required
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Confirm new Password"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-center mt-4">
          <Button
            key="save"
            type="primary"
            style={{ background: "#6DBD44", borderColor: "#6DBD44" }}
            onClick={handleSave}
          >
            Save & Change
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
