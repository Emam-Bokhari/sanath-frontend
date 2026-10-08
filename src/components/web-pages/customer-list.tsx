"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Avatar,
  Space,
  Typography,
  Divider,
  Tag,
  Checkbox,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import CustomSearchInput from "../ui/CustomInput";
import { toast } from "sonner";

const { Title, Text } = Typography;

interface Customer {
  key: string;
  sno: string;
  name: string;
  email: string;
  companyName: string;
  address?: string;
  contactNumber?: string;
  avatar?: string;
}

interface Quote {
  key: string;
  quoteNo: number;
  executive: string;
  manager: string;
  recipe: string;
  weight: string;
  price: string;
  deliveryTime: string;
  status: "Pending" | "Processing" | "On Way" | "Delivered";
}

const mockCustomers: Customer[] = [
  {
    key: "1",
    sno: "sr123401",
    name: "X Mans Farm",
    email: "mr101@gmail.ru",
    companyName: "(+27)7 00 55 59 27",
    address: "284 Daffodil Dr, Mount Frere, Eastern Cape, 5088 South Africa",
    contactNumber: "073 155 4568",
  },
  {
    key: "2",
    sno: "sr123402",
    name: "FLASH Point",
    email: "mr101@gmail.ru",
    companyName: "(+27)7 00 55 59 27",
    address: "123 Business Ave, Cape Town, South Africa",
    contactNumber: "073 155 4569",
  },
  {
    key: "3",
    sno: "sr123403",
    name: "wayne Farm",
    email: "mr101@gmail.ru",
    companyName: "(+27)7 00 55 59 27",
    address: "456 Farm Road, Johannesburg, South Africa",
    contactNumber: "073 155 4570",
  },
  {
    key: "4",
    sno: "sr123404",
    name: "wayne Farm",
    email: "xterris@gmail.com",
    companyName: "(+27)7 00 55 59 27",
    address: "789 Rural Lane, Durban, South Africa",
    contactNumber: "073 155 4571",
  },
  {
    key: "5",
    sno: "sr123405",
    name: "Babalwa Farm",
    email: "irnabela@gmail.com",
    companyName: "(+27)7 00 55 59 27",
    address: "321 Green Valley, Port Elizabeth, South Africa",
    contactNumber: "073 155 4572",
  },
  {
    key: "6",
    sno: "sr123406",
    name: "Rashied Farm",
    email: "codence@gmail.com",
    companyName: "(+27)7 00 55 59 27",
    address: "654 Harvest Street, Bloemfontein, South Africa",
    contactNumber: "073 155 4573",
  },
  {
    key: "7",
    sno: "sr123407",
    name: "Candice Farm",
    email: "quasioh@gmail.com",
    companyName: "(+27)7 00 55 59 27",
    address: "987 Crop Circle, Pretoria, South Africa",
    contactNumber: "073 155 4574",
  },
  {
    key: "8",
    sno: "sr123408",
    name: "Mark Farm",
    email: "xeno@yandex.ru",
    companyName: "(+27)7 00 55 59 27",
    address: "147 Field View, Polokwane, South Africa",
    contactNumber: "073 155 4575",
  },
  {
    key: "9",
    sno: "sr123409",
    name: "Sharief Farm",
    email: "redaniel@gmail.com",
    companyName: "(+24)7 00 55 59 27",
    address: "258 Agriculture Ave, Kimberley, South Africa",
    contactNumber: "073 155 4576",
  },
  {
    key: "10",
    sno: "sr123410",
    name: "Alison De Farm",
    email: "warn@mail.ru",
    companyName: "(+27)7 00 55 59 27",
    address: "369 Farming Road, Nelspruit, South Africa",
    contactNumber: "073 155 4577",
  },
  {
    key: "11",
    sno: "sr123411",
    name: "Sham Farm",
    email: "joie@gmail.com",
    companyName: "(+27)7 00 55 59 27",
    address: "741 Rural Route, Rustenburg, South Africa",
    contactNumber: "073 155 4578",
  },
  {
    key: "12",
    sno: "sr123412",
    name: "a Farm",
    email: "zlar@gmail.com",
    companyName: "(+27)7 00 55 59 27",
    address: "852 Country Lane, Upington, South Africa",
    contactNumber: "073 155 4579",
  },
  {
    key: "13",
    sno: "sr123413",
    name: "golden Farm",
    email: "ahana@mail.ru",
    companyName: "(+27)7 00 55 59 27",
    address: "963 Golden Fields, George, South Africa",
    contactNumber: "073 155 4580",
  },
  {
    key: "14",
    sno: "sr123414",
    name: "BAF Farm",
    email: "ahana@mail.ru",
    companyName: "(+27)7 00 55 59 27",
    address: "159 Business Farm, East London, South Africa",
    contactNumber: "073 155 4581",
  },
  {
    key: "15",
    sno: "sr123415",
    name: "North Farm",
    email: "joie@gmail.com",
    companyName: "(+27)7 00 55 59 27",
    address: "357 Northern Plains, Pietermaritzburg, South Africa",
    contactNumber: "073 155 4582",
  },
];

const mockQuotes: Quote[] = [
  {
    key: "1",
    quoteNo: 2472,
    executive: "Asad ujjaman",
    manager: "Mr. Nadir",
    recipe: "NPKC Recipe 1, 2more",
    weight: "2 Tonnes",
    price: "R20,000",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Pending",
  },
  {
    key: "2",
    quoteNo: 2450,
    executive: "Shameemah",
    manager: "Mr. Nadir",
    recipe: "NPKC Recipe 1, 1more",
    weight: "22 Tonnes",
    price: "R220,000",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Processing",
  },
  {
    key: "3",
    quoteNo: 2450,
    executive: "Sabbir",
    manager: "Babalwa Moloi",
    recipe: "NPKC Recipe 1, 1more",
    weight: "22 Tonnes",
    price: "R220,000",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "On Way",
  },
  {
    key: "4",
    quoteNo: 2450,
    executive: "Awami Santo",
    manager: "SM. Albard",
    recipe: "NPKC Recipe 1, 1more",
    weight: "32 Tonnes",
    price: "R320,000",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Delivered",
  },
];

export default function CustomerList() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleInfoClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCustomer(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Processing":
        return "blue";
      case "On Way":
        return "purple";
      case "Delivered":
        return "green";
      default:
        return "default";
    }
  };

  const customerColumns: ColumnsType<Customer> = [
    // {
    //   title: "",
    //   dataIndex: "checkbox",
    //   width: 50,
    //   render: () => <Checkbox />,
    // },
    {
      title: "S.no",
      dataIndex: "sno",
      key: "sno",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Phone Number",
      dataIndex: "companyName",
      key: "companyName",
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={() => handleInfoClick(record)}
          style={{ color: "#1890ff" }}
        />
      ),
    },
  ];

  const quoteColumns: ColumnsType<Quote> = [
    {
      title: "Quote. no.",
      dataIndex: "quoteNo",
      key: "quoteNo",
      width: 100,
    },
    {
      title: "S. executive",
      dataIndex: "executive",
      key: "executive",
      width: 120,
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      width: 120,
    },
    {
      title: "Quote Recipe",
      dataIndex: "recipe",
      key: "recipe",
      width: 180,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: 100,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
    },
    {
      title: "Delivery Time",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: () => (
        <Button
          onClick={() => toast.info("Feature coming soon!")}
          type="text"
          icon={<InfoCircleOutlined />}
          style={{ color: "#1890ff" }}
        />
      ),
    },
  ];

  // Filter customers based on search text
  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.sno.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate paginated data
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // Handle pagination changes
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div
      style={{
        padding: "0 24px 24px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Customer List
          </Title>
          <Space>
            <Input
              placeholder="Search here"
              prefix={
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
              style={{ width: 350, padding: "4px 6px", borderRadius: "30px" }}
            />
            <Button
              style={{
                padding: "22px",
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              icon={
                <FilterOutlined style={{ fontSize: "20px", padding: "10px" }} />
              }
            />
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={customerColumns}
          dataSource={paginatedCustomers} // Use paginated data
          pagination={{
            total: filteredCustomers.length, // Use filtered data length
            pageSize: pageSize,
            current: currentPage,
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "20"], // Allow changing page size
            showQuickJumper: false,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} out of ${total}`,
          }}
          onChange={handleTableChange} // Handle pagination changes
          size="middle"
        />
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
          <Modal
            title="Customer Details"
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width={1200}
            styles={{
              body: { paddingTop: "24px" },
            }}
          >
            {selectedCustomer && (
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginBottom: "16px",
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "16px",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    size={200}
                    src="/people/customer.png?height=250&width=250"
                    style={{}}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: "16px" }}>
                      <Text
                        strong
                        style={{ display: "inline-block", width: "140px" }}
                      >
                        Customer Name
                      </Text>
                      <Text>: {selectedCustomer.name}</Text>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <Text
                        strong
                        style={{ display: "inline-block", width: "140px" }}
                      >
                        Address
                      </Text>
                      <Text>: {selectedCustomer.address}</Text>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <Text
                        strong
                        style={{ display: "inline-block", width: "140px" }}
                      >
                        Serial Number
                      </Text>
                      <Text>: {selectedCustomer.sno}</Text>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <Text
                        strong
                        style={{ display: "inline-block", width: "140px" }}
                      >
                        Email
                      </Text>
                      <Text>: {selectedCustomer.email}</Text>
                    </div>
                    <div>
                      <Text
                        strong
                        style={{ display: "inline-block", width: "140px" }}
                      >
                        Contact Number
                      </Text>
                      <Text>: {selectedCustomer.contactNumber}</Text>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Title level={4} style={{ margin: 0 }}>
                      Quotes List
                    </Title>
                    <Space>
                      {/* <Input
                        placeholder="Search here"
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                      /> */}
                      <Input
                        placeholder="Search here"
                        prefix={
                          <SearchOutlined
                            style={{
                              fontSize: "18px",
                              borderRadius: "50%",
                              padding: "5px",
                              backgroundColor: "#D2EBC5",
                            }}
                          />
                        }
                        style={{
                          width: 250,
                          padding: "4px 6px",
                          borderRadius: "30px",
                        }}
                      />
                      <Button icon={<FilterOutlined />} />
                    </Space>
                  </div>

                  <Table
                    columns={quoteColumns}
                    dataSource={mockQuotes}
                    pagination={false}
                    size="small"
                    scroll={{ x: 1000 }}
                  />
                </div>
              </div>
            )}
          </Modal>
        </ConfigProvider>
      </div>
    </div>
  );
}
