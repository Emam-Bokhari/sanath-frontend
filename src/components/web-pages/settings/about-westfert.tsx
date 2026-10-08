"use client";

import { useRef, useState } from "react";
import { Button, Typography, Card, ConfigProvider } from "antd";
import dynamic from "next/dynamic";
// import JoditEditor from "jodit-react";
import CreateProfileModal from "@/components/Modal/CreateProfileModal";
import { toast } from "sonner";
import { PlusOutlined } from "@ant-design/icons";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const { Title } = Typography;
interface StaffMember {
  key: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  status: "active" | "inactive";
}

export default function AboutWestfert() {
  const [isCreateProfileModalVisible, setIsCreateProfileModalVisible] =
    useState(false);
  const [content, setContent] = useState("");

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const editor = useRef(null);

  const config = {
    readonly: false,
    placeholder: "Start typings...",
    style: {
      height: 400,
      background: "white",
    },
  };

  const handleProfileSave = (data: {
    userName: string;
    designationType: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    // Map the modal data to StaffMember if needed
    const newStaffMember: StaffMember = {
      key: Date.now().toString(),
      id: Math.random().toString(36).substr(2, 10).toUpperCase(),
      name: data.userName,
      email: data.email,
      phone: "", // You may want to collect this in the modal
      designation: data.designationType,
      status: "active",
    };
    console.log("Saved data:", newStaffMember);
    // Handle save logic here
    toast.success("Profile created successfully!");
    // setIsModalVisible(false);
  };
  return (
    <div
      style={{
        padding: "0 24px",
      }}
    >
      <div style={{}}>
        <Card
          style={{
            borderRadius: "24px",
            boxShadow: "0 2px 8px rgba(0, 0,0, 0.1)",

            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Title level={2} style={{ margin: 0, color: "#333" }}>
              About Westfert
            </Title>
            <Button
              onClick={() => {
                setIsCreateProfileModalVisible(true);
              }}
              type="primary"
              icon={<PlusOutlined />}
              style={{
                background: "#6DBD44",
                borderColor: "#6DBD44",
                borderRadius: "20px",
                padding: "20px 20px",
                fontWeight: "400",
                fontSize: "16px",
              }}
            >
              Add Member
            </Button>
          </div>
          <div className="jodit-container">
            <div>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => {}}
              />
            </div>
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                style={{
                  height: 40,
                  width: "150px",
                  backgroundColor: "#6DBD44",
                }}
                type="primary"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>

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
        <CreateProfileModal
          visible={isCreateProfileModalVisible}
          onClose={() => setIsCreateProfileModalVisible(false)}
          onSave={handleProfileSave}
          refetch={() => {}}
        />
      </ConfigProvider>
    </div>
  );
}
