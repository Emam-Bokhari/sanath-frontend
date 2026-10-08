"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Typography,
  Card,
  Tooltip,
  ConfigProvider,
  Spin,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import EmployeeDetailsModal from "../Modal/EmployeeDetailsModal";
import { toast } from "sonner";
import CreateProfileModal from "../Modal/CreateProfileModal";
import Spinner from "../Spinner";

const { Title } = Typography;

interface StaffMember {
  key: string;
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  designation: string;
  status: string;
  createdAt: string;
}

interface ApiStaffData {
  _id: string;
  userName: string;
  email: string;
  password: string;
  designation: string;
  status: string;
  createdAt: string;
  contactNumber: string;
}

export default function StaffListPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<StaffMember | null>(
    null,
  );
  const [isCreateProfileModalVisible, setIsCreateProfileModalVisible] =
    useState(false);

  // TODO: Get users from API
  const users = null;
  const isLoading = false;
  const error = null;
  const refetch = () => {};

  // TODO: Get updateStatus from API
  const updateStatus = () => {};

  // console.log(users);
  // Transform API data to match component structure
  const transformedStaffData: StaffMember[] = useMemo(() => {
    if (!users) return [];

    return (users as ApiStaffData[]).map(
      (user: ApiStaffData, index: number) => ({
        key: user._id,
        id: user._id.slice(-8).toUpperCase(), // Use last 8 characters of _id as display ID
        name: user.userName,
        email: user.email,
        contactNumber: user.contactNumber, // contactNumber not available in API data
        designation: user.designation,
        status: user.status,
        createdAt: user.createdAt,
      }),
    );
  }, [users]);

  const columns: ColumnsType<StaffMember> = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: "500" }}>ID No.</span>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (text: string, record: StaffMember) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#666" }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (text: string) => (
        <span style={{ fontWeight: "500" }}>{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text: string) => <span style={{ color: "#666" }}>{text}</span>,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (text: string) => (
        <span style={{ color: "#666" }}>
          {new Date(text).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      width: 150,
      render: (text: string) => (
        <Tag
          color={text === "Manager" ? "orange" : "blue"}
          style={{ border: "none", borderRadius: "4px", fontWeight: "500" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text: string) => (
        <Tag
          color={text === "active" ? "green" : "red"}
          style={{ border: "none", borderRadius: "4px", fontWeight: "500" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record: StaffMember) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              style={{ color: "#666" }}
              onClick={() => {
                setSelectedEmployee(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip
            title={record.status === "active" ? "Deactivate" : "Activate"}
          >
            <Button
              type="text"
              onClick={() => handleUpdateStatus(record.key, record.status)}
              icon={
                record.status === "active" ? (
                  <LockOutlined />
                ) : (
                  <UnlockOutlined />
                )
              }
              size="small"
              style={{
                color: record.status === "active" ? "#ff4d4f" : "#52c41a",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const filteredData = transformedStaffData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchText.toLowerCase()),
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleProfileSave = (data: {
    userName: string;
    designationType: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    // Handle the creation of new staff member
    console.log("Creating new staff member:", data);
    toast.success("Profile created successfully!");
    refetch();
    setIsCreateProfileModalVisible(false);
    // You would typically make an API call here to create the new user
  };

  // if (isLoading) {
  //   return <Spinner />;
  // }

  if (error) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <div style={{ color: "#ff4d4f", marginBottom: "16px" }}>
          Error loading staff data
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // handle update status
  const handleUpdateStatus = (id: string, status: string) => {
    const newStatus = status === "active" ? "inactive" : "active";

    // try {
    //   toast.promise(
    //     updateStatus({ id, data: { status: newStatus } }).unwrap(),
    //     {
    //       loading: "Updating status...",
    //       success: (res) => {
    //         console.log("API response:", res);
    //         if (res?.modifiedCount > 0) {
    //           refetch();
    //           return <b>Status Updated Successfully</b>;
    //         }
    //         return <b>Status was already {newStatus}</b>;
    //       },
    //       error: (err) =>
    //         err?.message || err?.data?.message || "Failed to update status!",
    //     }
    //   );
    // } catch (err) {
    //   toast.error("An error occurred!");
    // }
    // };

    return (
      <div style={{ padding: "0 24px 24px" }}>
        <Card
          style={{
            borderRadius: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <Title level={3} style={{ margin: 0, color: "#333" }}>
              Employee List ({transformedStaffData.length})
            </Title>
            <Space size="middle">
              <Input
                placeholder="Search by name, email, or designation"
                allowClear
                style={{
                  width: 350,
                  padding: "4px 6px 4px 10px",
                  borderRadius: "30px",
                }}
                suffix={
                  <SearchOutlined
                    style={{
                      fontSize: "18px",
                      borderRadius: "50%",
                      padding: "10px",
                      backgroundColor: "#D2EBC5",
                    }}
                  />
                }
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
              <Button
                style={{
                  padding: "22px",
                  borderRadius: "50%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                icon={
                  <FilterOutlined
                    style={{ fontSize: "20px", padding: "10px" }}
                  />
                }
              />
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
            </Space>
          </div>

          {selectedRowKeys.length > 0 && (
            <div
              style={{
                marginBottom: "16px",
                padding: "8px 16px",
                backgroundColor: "#f0f8ff",
                borderRadius: "8px",
              }}
            >
              <span style={{ color: "#1890ff" }}>
                {selectedRowKeys.length} item(s) selected
              </span>
              <Button
                type="link"
                size="small"
                onClick={() => setSelectedRowKeys([])}
                style={{ marginLeft: "8px" }}
              >
                Clear selection
              </Button>
            </div>
          )}
          {isLoading ? (
            <Spinner />
          ) : (
            <Table
              columns={columns}
              dataSource={paginatedData}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredData.length,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} employees`,
                pageSizeOptions: ["10", "20", "50", "100"],
                onShowSizeChange: (current, size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                },
                itemRender: (current, type, originalElement) => {
                  if (type === "prev") {
                    return <Button size="small">Previous</Button>;
                  }
                  if (type === "next") {
                    return <Button size="small">Next</Button>;
                  }
                  return originalElement;
                },
              }}
              scroll={{ x: 1000 }}
              size="middle"
              rowSelection={rowSelection}
              style={{ background: "#fff" }}
              loading={isLoading}
            />
          )}
        </Card>

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
          <EmployeeDetailsModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            employee={selectedEmployee}
          />
          <CreateProfileModal
            visible={isCreateProfileModalVisible}
            onClose={() => setIsCreateProfileModalVisible(false)}
            onSave={handleProfileSave}
            refetch={refetch}
          />
        </ConfigProvider>
      </div>
    );
  };
}
