"use client";

import { useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Button,
  Form,
  message,
  Row,
  Col,
  Divider,
  ConfigProvider,
} from "antd";
import { EditOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import EditProfileModal from "../Modal/EditProfileModal";
import ChangePasswordModal from "../Modal/ChangePasswordModal";
import { toast } from "sonner";
import Spinner from "../Spinner";

const { Title, Text } = Typography;

interface ProfileData {
  name: string;
  position: string;
  idNo: string;
  email: string;
  contactNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Admin Humphrey",
    position: "Admin",
    idNo: "MM4178MRV2",
    email: "Asadujaman101@bd.com",
    contactNumber: "073 135 4568",
    dateOfBirth: "12 nov, 2024",
    gender: "Male",
    address: "284 Daffodil Dr, Mount Frere, Eastern Cape -5088 South Africa",
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    form.setFieldsValue({
      ...profileData,
      dateOfBirth: dayjs(profileData.dateOfBirth, "DD MMM, YYYY"),
    });
    setIsEditModalVisible(true);
  };

  const handleSettings = () => {
    setIsSettingsModalVisible(true);
  };

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      const updatedData = {
        ...values,
        dateOfBirth: values.dateOfBirth.format("DD MMM, YYYY"),
      };
      setProfileData(updatedData);
      setIsEditModalVisible(false);
      message.success("Profile updated successfully");
    });
  };

  const profileFields = [
    { label: "Name", value: profileData.name, key: "name" },
    { label: "Position", value: profileData.position, key: "position" },
    { label: "Id. no", value: profileData.idNo, key: "idNo" },
    { label: "Email", value: profileData.email, key: "email" },
    {
      label: "Contact Number",
      value: profileData.contactNumber,
      key: "contactNumber",
    },
    {
      label: "Date of birth",
      value: profileData.dateOfBirth,
      key: "dateOfBirth",
    },
    { label: "Gender", value: profileData.gender, key: "gender" },
    { label: "Address", value: profileData.address, key: "address" },
  ];

  const handleSave = (data: any) => {
    console.log("Saved data:", data);
    // Handle save logic here
    toast.success("Profile updated successfully!");
  };

  const handlePasswordSave = (data: any) => {
    console.log("Password changed:", data);
    // Handle password change logic here
    toast.success("Password changed successfully!");
  };

  return (
    <div
      style={{
        padding: "0 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          width: "100%",
          borderRadius: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        styles={{ body: { padding: "32px" } }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <Row gutter={32}>
            {/* Left Column - Profile Photo and Basic Info */}
            <Col xs={24} md={5}>
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={250}
                  src="/user.jpg?height=250&width=250"
                  icon={<UserOutlined />}
                  style={{
                    marginBottom: 16,
                    border: "4px solid #f0f0f0",
                    borderRadius: 12,
                  }}
                />
                <Title
                  level={4}
                  style={{ margin: "8px 0 4px 0", color: "#333" }}
                >
                  {profileData?.name}
                </Title>
                <Text style={{ color: "#1890ff", fontSize: 16 }}>
                  {profileData?.position}
                </Text>
              </div>
            </Col>

            {/* Right Column - Detailed Information */}
            <Col xs={24} md={18}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Title level={3} style={{ margin: 0, color: "#333" }}>
                  Profile Information
                </Title>
                <Space>
                  <Button
                    type="text"
                    icon={<SettingOutlined />}
                    onClick={handleSettings}
                    style={{ color: "#666" }}
                  />
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ color: "#666" }}
                  />
                </Space>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {profileFields.map((field, index) => (
                  <div key={field.key}>
                    <Row>
                      <Col span={8}>
                        <Text
                          style={{
                            color: "#888",
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {field.label}
                        </Text>
                      </Col>
                      <Col span={16}>
                        <Text
                          style={{
                            color: "#333",
                            fontSize: 14,
                            wordBreak: "break-word",
                          }}
                        >
                          {field.value}
                        </Text>
                      </Col>
                    </Row>
                    {index < profileFields.length - 1 && (
                      <Divider style={{ margin: "12px 0" }} />
                    )}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        )}

        {/* modal */}
        <ConfigProvider
          theme={{
            components: {
              Modal: {
                contentBg: "rgb(241,241,249)",
                headerBg: "rgb(241,241,249)",
              },
            },
          }}
        >
          <EditProfileModal
            visible={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
            onSave={handleSave}
            initialData={{
              userName: "",
              contactNumber: "",
              //   squareNumber: "123",
              dateOfBirth: "1990-01-01",
              gender: "Male",
              address: "Netherlands",
            }}
          />
          <ChangePasswordModal
            visible={isSettingsModalVisible}
            onClose={() => setIsSettingsModalVisible(false)}
            onSave={handlePasswordSave}
          />
        </ConfigProvider>
      </Card>
    </div>
  );
}
