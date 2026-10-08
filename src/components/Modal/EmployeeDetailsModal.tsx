"use client";

import {
  Modal,
  Row,
  Col,
  Avatar,
  Typography,
  Tag,
  Button,
  Space,
  Input,
  Table,
  Select,
  Card,
} from "antd";
import {
  CloseOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  SyncOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import Paragraph from "antd/es/typography/Paragraph";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";


const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface EmployeeDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  employee?: any;
}

interface WorkItem {
  key: string;
  quoteNo: string;
  farmersName: string;
  manager: string;
  quoteRecipe: string;
  weight: string;
  price: string;
  deliveryTime: string;
  status: "Pending" | "Processing" | "On way" | "Delivered";
}

export default function EmployeeDetailsModal({
  visible,
  onClose,
  employee,
}: EmployeeDetailsModalProps) {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  // Demo performance data
  const performanceData = [
    { month: "Jan", sale: 750, target: 800 },
    { month: "Feb", sale: 820, target: 850 },
    { month: "Mar", sale: 780, target: 800 },
    { month: "Apr", sale: 890, target: 900 },
    { month: "May", sale: 920, target: 950 },
    { month: "Jun", sale: 850, target: 900 },
    { month: "Jul", sale: 950, target: 1000 },
    { month: "Aug", sale: 880, target: 900 },
    { month: "Sep", sale: 920, target: 950 },
    { month: "Oct", sale: 980, target: 1000 },
    { month: "Nov", sale: 890, target: 900 },
    { month: "Dec", sale: 920, target: 950 },
  ];

  // Demo work list data
  const workListData = [
    {
      key: "1",
      quoteNo: "2450",
      farmersName: "X Mans Farm",
      manager: "Mr. Nadir",
      quoteRecipe: "NPKC Recipe 1, 2more",
      weight: "2 Tonnes",
      price: "R20,000",
      deliveryTime: "12/1/2024 , 12:30 am",
      status: "Pending",
    },
    {
      key: "2",
      quoteNo: "2450",
      farmersName: "FLASH Point",
      manager: "Mr. Nadir",
      quoteRecipe: "NPKC Recipe 1, 1more",
      weight: "22 Tonnes",
      price: "R220,000",
      deliveryTime: "12/1/2024 , 12:30 am",
      status: "Processing",
    },
  ];

  const workListColumns = [
    { title: "Quote. no.", dataIndex: "quoteNo", key: "quoteNo", width: 80 },
    {
      title: "Farmers Name",
      dataIndex: "farmersName",
      key: "farmersName",
      width: 120,
    },
    { title: "Manager", dataIndex: "manager", key: "manager", width: 120 },
    {
      title: "Quote Recipe",
      dataIndex: "quoteRecipe",
      key: "quoteRecipe",
      width: 150,
    },
    { title: "Weight", dataIndex: "weight", key: "weight", width: 100 },
    { title: "Price", dataIndex: "price", key: "price", width: 100 },
    {
      title: "Delivery Time",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
      width: 140,
      render: (text: string) => (
        <span style={{ color: "#1890ff" }}>{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        let color = "default";
        switch (status) {
          case "Pending":
            color = "orange";
            break;
          case "Processing":
            color = "blue";
            break;
          case "On way":
            color = "gold";
            break;
          case "Delivered":
            color = "green";
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<SyncOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const handleSettings = () => {
    setChangePasswordModal(true);
    onClose();
    // toast.success("settings clicked!");
  };

  const handleEdit = () => {
    // toast.success("Edit clicked!");
    setIsEditProfileModalOpen(true);
    onClose();
  };

  // update profile
  const handleSave = async (formData: any) => {
    console.log("Saved data:", formData);
    // Handle save logic here
    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );
      // toast.promise(
        // updateProfile({
        //   id: employee.key,
        //   data: filteredData,
        // }).unwrap(),
        // {
        //   loading: "Updating Profile",
        //   success: (res) => {
        //     refetch(); // if needed to refresh data
        //     setIsEditProfileModalOpen(false);

        //     return <b>{res.message || "Profile updated successfully"}</b>;
        //   },
        //   error: (err) => err.data?.message || err.message || "Update failed",
        // }
      // );

      // toast.success(response.message || "Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSave = (data: any) => {
    console.log("Password changed:", data);
    // Handle password change logic here
    toast.success("Password changed successfully!");
    setChangePasswordModal(false);
  };
  return (
    <>
      <Modal
        title={"Employee Details"}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={employee?.designation === "Manager" ? 600 : 1200}
        style={{ top: 20 }}
        closeIcon={<CloseOutlined />}
      >
        {employee?.designation === "Manager" ? (
          <div
            style={{
              display: "flex",
              gap: "20px",
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div>
              <Avatar
                style={{ borderRadius: "12px" }}
                size={160}
                src="/people/person1.png"
                className="object-cover rounded-lg"
              />
              <div style={{ flex: 1, textAlign: "center" }}>
                <Title level={5} style={{ marginBottom: "2px" }}>
                  Mr. {employee.name}
                </Title>
                <Paragraph
                  type="secondary"
                  style={{ marginBottom: "0", color: "#FF8000" }}
                >
                  {employee.designation}
                </Paragraph>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center ">
                <Paragraph>
                  <strong>Name:</strong> {employee.name}
                </Paragraph>
                <div className="flex gap-4 ">
                  <SettingOutlined
                    size={25}
                    className="cursor-pointer"
                    onClick={handleSettings}
                  />
                  <EditOutlined
                    size={25}
                    className="cursor-pointer"
                    onClick={handleEdit}
                  />
                </div>
              </div>
              <Paragraph>
                <strong>Position:</strong> {employee.designation}
              </Paragraph>
              <Paragraph>
                <strong>ID no.:</strong> {employee.id}
              </Paragraph>
              <Paragraph>
                <strong>Email:</strong> {employee.email}
              </Paragraph>
              <Paragraph>
                <strong>Contact Number:</strong> {employee?.contactNumber}
              </Paragraph>
              <Paragraph>
                <strong>Status:</strong> {employee.status}
              </Paragraph>
              <Paragraph>
                <strong>Date of birth:</strong> 30 Dec, 2000
              </Paragraph>
              <Paragraph>
                <strong>Gender:</strong> Male
              </Paragraph>
              <Paragraph>
                <strong>Address:</strong> Lakshmipur, Chittagong, Bangladesh
              </Paragraph>
              {/* Add more fields as per your design */}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "12px",
            }}
          >
            {/* Header */}

            <Row gutter={[24, 24]}>
              {/* Left Column - Employee Photo and Basic Info */}
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Avatar
                    style={{ borderRadius: "12px" }}
                    size={160}
                    src="/people/person2.png"
                    className="object-cover rounded-lg"
                  />
                  <div>
                    <Title level={5} style={{ margin: "8px 0 4px 0" }}>
                      {employee?.name}
                    </Title>
                    <Tag color="blue" style={{ marginBottom: "16px" }}>
                      {employee?.designation}
                    </Tag>
                    <div>
                      <Space>
                        <Button
                          type="text"
                          icon={<SettingOutlined />}
                          size="small"
                          onClick={handleSettings}
                        />
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          size="small"
                          onClick={handleEdit}
                        />
                      </Space>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Middle Column - Employee Details */}
              <Col span={10}>
                <div style={{ padding: "0 16px" }}>
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text strong>Name</Typography.Text>
                      <Typography.Text> {employee?.name}</Typography.Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text strong>Position</Typography.Text>
                      <Typography.Text>{employee?.designation}</Typography.Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text strong>Id. no.</Typography.Text>
                      <Typography.Text> {employee?.id}</Typography.Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text strong>Email</Typography.Text>
                      <Typography.Text> {employee?.email}</Typography.Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text strong>Contact Number</Typography.Text>
                      <Typography.Text> {employee?.contactNumber}</Typography.Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text strong>Date of birth</Typography.Text>
                      <Typography.Text> 12 nov, 2024</Typography.Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text strong>Gender</Typography.Text>
                      <Typography.Text> Male</Typography.Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text strong>Address</Typography.Text>
                      <Typography.Text
                        style={{ textAlign: "right", maxWidth: "200px" }}
                      >
                        284 Daffodil Dr, Mount Frere, Eastern Cape -5088 South
                        Africa
                      </Typography.Text>
                    </div>
                  </Space>
                </div>
              </Col>

              {/* Right Column - Performance Statistics */}
              <Col span={8}>
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Performance Statistics</span>
                      <Select
                        defaultValue="Year"
                        size="small"
                        style={{ width: 80 }}
                      >
                        <Select.Option value="Year">Year</Select.Option>
                        <Select.Option value="Month">Month</Select.Option>
                      </Select>
                    </div>
                  }
                  size="small"
                >
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#52c41a",
                        }}
                      ></div>
                      <Typography.Text style={{ fontSize: "12px" }}>
                        Total Sale: R20,204.0
                      </Typography.Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#1890ff",
                        }}
                      ></div>
                      <Typography.Text style={{ fontSize: "12px" }}>
                        Monthly Sale: R19,200
                      </Typography.Text>
                    </div>
                  </div>
                  <div style={{ height: "200px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="sale" fill="#52c41a" />
                        <Bar dataKey="target" fill="#1890ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Work List Section */}
            <div style={{ marginTop: "32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Title level={5} style={{ margin: 0 }}>
                  Work list of employees
                </Title>
                <Space>
                  <Input
                    placeholder="Search here"
                    style={{ width: 250 }}
                    suffix={<SearchOutlined />}
                  />
                  <Button icon={<FilterOutlined />}></Button>
                </Space>
              </div>

              <Table
                columns={workListColumns}
                dataSource={workListData}
                pagination={false}
                size="small"
                scroll={{ x: 1000 }}
              />
            </div>
          </div>
        )}
      </Modal>

      <EditProfileModal
        visible={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={handleSave}
        initialData={{
          userName: employee ? employee.name : "",
          contactNumber: employee ? employee.phone : "",
          //   squareNumber: "123",
          dateOfBirth: "1990-01-01",
          gender: "Male",
          address: "Netherlands",
        }}
      />
      <ChangePasswordModal
        visible={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
        onSave={handlePasswordSave}
      />
    </>
  );
}
