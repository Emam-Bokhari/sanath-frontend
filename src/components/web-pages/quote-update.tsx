"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Space,
  Typography,
  Tag,
  Checkbox,
  Select,
  Dropdown,
  Avatar,
  Divider,
  Row,
  Col,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  EnvironmentOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { toast } from "sonner";
// import menu from "antd/es/menu"; // Remove this line, not needed

const { Title, Text } = Typography;
const { Option } = Select;

interface Quote {
  key: string;
  quoteNo: number;
  farmersName: string;
  executive: string;
  quoteRecipe: string;
  weight: string;
  price: string;
  deliveryTime: string;
  status: "Draft" | "Pending" | "Sent" | "Approved" | "Accepted";
  manager?: string;
  locked?: boolean;
  customerAddress?: string;
  warehouseAddress?: string;
  distance?: string;
  acceptanceDate?: string;
  quoteTime?: string;
  recipeDetails?: {
    name: string;
    item: string;
    weight: string;
    price: string;
  };
  summary?: {
    subtotal: string;
    freight: string;
    adjustPoints: string;
    total: string;
  };
}

const mockQuotes: Quote[] = [
  {
    key: "1",
    quoteNo: 2472,
    farmersName: "X Mans Farm",
    executive: "Asad ujjaman",
    quoteRecipe: "NPKC Recipe 1, 2more",
    weight: "2 Tonnes",
    price: "R20,0.00",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Draft",
    manager: "Mr. Nadir",
    locked: false,
    customerAddress: "1 Emerald Blvd, Modderfontein, Lethabong, Gauteng 1609",
    warehouseAddress: "2492 Sondown Rd, Brakpan, Gauteng- 1542 South Africa",
    distance: "20 km",
    acceptanceDate: "12/1/2024 , 12:30 am",
    quoteTime: "12/1/2024 , 12:30 am",
    recipeDetails: {
      name: "NPKC Recipe",
      item: "20 Pcs",
      weight: "20 Tonnes",
      price: "R400",
    },
    summary: {
      subtotal: "R400",
      freight: "R350",
      adjustPoints: "10%",
      total: "R1180",
    },
  },
  {
    key: "2",
    quoteNo: 2450,
    farmersName: "FLASH Point",
    executive: "Fahim",
    quoteRecipe: "NPKC Recipe 1, 1more",
    weight: "22 Tonnes",
    price: "R220,0.00",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Pending",
    manager: "Mr. Nadir",
    locked: true,
  },
  {
    key: "3",
    quoteNo: 2450,
    farmersName: "wayne Farm",
    executive: "Sabbir",
    quoteRecipe: "NPKC Recipe 1, 1more",
    weight: "22 Tonnes",
    price: "R220,0.00",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Sent",
    manager: "Babalwa Moloi",
    locked: false,
  },
  {
    key: "4",
    quoteNo: 2450,
    farmersName: "wayne Farm",
    executive: "Santo",
    quoteRecipe: "NPKC Recipe 1, 1more",
    weight: "32 Tonnes",
    price: "R320,0.00",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Approved",
    manager: "SM. Albard",
    locked: true,
  },
  {
    key: "5",
    quoteNo: 2450,
    farmersName: "Babalwa Farm",
    executive: "Babalwa Farm",
    quoteRecipe: "NPKC Recipe 1, 1more",
    weight: "33 Tonnes",
    price: "R20,0.00",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Accepted",
    manager: "Mr. Johnson",
    locked: false,
  },
  {
    key: "6",
    quoteNo: 2465,
    farmersName: "Rashied Farm",
    executive: "Rashied Farm",
    quoteRecipe: "NPKC Recipe 1, 1more",
    weight: "100 Tonnes",
    price: "R220,0.00",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Accepted",
    manager: "Ms. Smith",
    locked: true,
  },
  {
    key: "7",
    quoteNo: 2472,
    farmersName: "Candice Farm",
    executive: "Candice Farm",
    quoteRecipe: "NPKC Recipe 1, 1more",
    weight: "58 Tonnes",
    price: "R220,0.00",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Accepted",
    manager: "Mr. Brown",
    locked: false,
  },
  {
    key: "8",
    quoteNo: 2465,
    farmersName: "Mark Farm",
    executive: "Mark Farm",
    quoteRecipe: "NPKC Recipe 1, 1more",
    weight: "36 Tonnes",
    price: "R320,0.00",
    deliveryTime: "12/1/2024 , 12:30 am",
    status: "Accepted",
    manager: "Ms. Davis",
    locked: true,
  },
];

export default function QuoteUpdate() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filterManager, setFilterManager] = useState<string>("");
  const [filterExecutive, setFilterExecutive] = useState<string>("");
  const [filterLocked, setFilterLocked] = useState<string>("");

  const handleInfoClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedQuote(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "red";
      case "Pending":
        return "red";
      case "Sent":
        return "blue";
      case "Approved":
        return "gold";
      case "Accepted":
        return "green";
      default:
        return "default";
    }
  };

  const filterItems: MenuProps["items"] = [
    {
      key: "status",
      label: "Status",
      children: [
        { key: "status-locked", label: "Locked" },
        { key: "status-unlock", label: "Unlock" },
      ],
    },
    {
      key: "manager",
      label: "Manager",
      children: [
        { key: "manager-locked", label: "Locked" },
        { key: "manager-unlock", label: "Unlock" },
      ],
    },
    {
      key: "sales-executive",
      label: "Sales executive",
      children: [
        { key: "sales-locked", label: "Locked" },
        { key: "sales-unlock", label: "Unlock" },
      ],
    },
  ];

  const quoteColumns: ColumnsType<Quote> = [
    {
      title: "",
      dataIndex: "checkbox",
      width: 50,
      render: () => <Checkbox />,
    },
    {
      title: "Quote. no.",
      dataIndex: "quoteNo",
      key: "quoteNo",
      width: 100,
    },
    {
      title: "Farmers Name",
      dataIndex: "farmersName",
      key: "farmersName",
      width: 150,
    },
    {
      title: "Executive",
      dataIndex: "executive",
      key: "executive",
      width: 120,
    },
    {
      title: "Quote Recipe",
      dataIndex: "quoteRecipe",
      key: "quoteRecipe",
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
      width: 120,
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
        <Select
          value={status}
          style={{ width: "100%" }}
          size="small"
          bordered={false}
        >
          <Option value="Draft">
            <Tag color={getStatusColor("Draft")}>Draft</Tag>
          </Option>
          <Option value="Pending">
            <Tag color={getStatusColor("Pending")}>Pending</Tag>
          </Option>
          <Option value="Sent">
            <Tag color={getStatusColor("Sent")}>Sent</Tag>
          </Option>
          <Option value="Approved">
            <Tag color={getStatusColor("Approved")}>Approved</Tag>
          </Option>
          <Option value="Accepted">
            <Tag color={getStatusColor("Accepted")}>Accepted</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<FilePdfOutlined />}
            style={{ color: "#ff4d4f" }}
          />
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => handleInfoClick(record)}
            style={{ color: "#1890ff" }}
          />
        </Space>
      ),
    },
  ];

  const filteredQuotes = mockQuotes.filter((quote) => {
    const matchesSearch =
      quote.farmersName.toLowerCase().includes(searchText.toLowerCase()) ||
      quote.executive.toLowerCase().includes(searchText.toLowerCase()) ||
      quote.quoteNo.toString().includes(searchText);

    const matchesManager = !filterManager || quote.manager === filterManager;
    const matchesExecutive =
      !filterExecutive || quote.executive === filterExecutive;
    const matchesLocked =
      !filterLocked ||
      (filterLocked === "locked" && quote.locked) ||
      (filterLocked === "unlocked" && !quote.locked);

    return matchesSearch && matchesManager && matchesExecutive && matchesLocked;
  });

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
            Quote Update
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
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 350, padding: "4px 6px", borderRadius: "30px" }}
            />
            <Dropdown
              menu={{ items: filterItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
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
            </Dropdown>
          </Space>
        </div>

        <Table
          columns={quoteColumns}
          dataSource={filteredQuotes}
          pagination={{
            total: filteredQuotes.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          size="middle"
          scroll={{ x: 1200 }}
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
            title={
              <div
                className="text-2xl"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Quote Details</span>
                <Button
                  icon={<CloseOutlined style={{ fontSize: "24px" }} />}
                  type="text"
                  onClick={handleModalClose}
                />
              </div>
            }
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width={1200}
            closeIcon={null}
            styles={
              {
                //   body: { padding: "24px" },
              }
            }
          >
            {selectedQuote && (
              <div className="mt-4">
                <div
                  className="bg-white p-6 rounded-2xl shadow-sm"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Text>Quotes status:</Text>
                    <Select value={selectedQuote.status} style={{ width: 120 }}>
                      <Option value="Pending">
                        <Tag color={getStatusColor("Pending")}>Pending</Tag>
                      </Option>
                      <Option value="Draft">
                        <Tag color={getStatusColor("Draft")}>Draft</Tag>
                      </Option>
                      <Option value="Sent">
                        <Tag color={getStatusColor("Sent")}>Sent</Tag>
                      </Option>
                      <Option value="Approved">
                        <Tag color={getStatusColor("Approved")}>Approved</Tag>
                      </Option>
                      <Option value="Accepted">
                        <Tag color={getStatusColor("Accepted")}>Accepted</Tag>
                      </Option>
                    </Select>
                  </div>
                  <Button
                    onClick={() => toast.info("Feature coming soon...")}
                    icon={<PrinterOutlined />}
                    type="primary"
                    ghost
                  >
                    Print
                  </Button>
                </div>

                <div className="bg-white p-6 pb-4 mb-4 rounded-2xl shadow-sm">
                  <Row
                    className=""
                    gutter={24}
                    style={{ marginBottom: "32px" }}
                  >
                    <Col span={4}>
                      <div>
                        <Text strong>Quote. no.</Text>
                        <div style={{ marginTop: "8px" }}>
                          <Text>{selectedQuote.quoteNo}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div>
                        <Text strong>executive</Text>
                        <div style={{ marginTop: "8px" }}>
                          <Text>{selectedQuote.executive}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div>
                        <Text strong>Customer Address</Text>
                        <div
                          style={{
                            marginTop: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Text>{selectedQuote.farmersName}</Text>
                          <InfoCircleOutlined style={{ color: "#1890ff" }} />
                        </div>
                        <div
                          style={{
                            marginTop: "8px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                          }}
                        >
                          <EnvironmentOutlined
                            style={{ color: "#ff4d4f", marginTop: "4px" }}
                          />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {selectedQuote.customerAddress}
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div>
                        <Text strong>Warehouse Address:</Text>
                        <div style={{ marginTop: "8px" }}>
                          <Text>Warehouse 1</Text>
                        </div>
                        <div
                          style={{
                            marginTop: "8px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                          }}
                        >
                          <EnvironmentOutlined
                            style={{ color: "#ff4d4f", marginTop: "4px" }}
                          />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {selectedQuote.warehouseAddress}
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div>
                        <Text strong>Distance :</Text>
                        <div
                          style={{
                            marginTop: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <EnvironmentOutlined style={{ color: "#1890ff" }} />
                          <Text>{selectedQuote.distance}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div style={{}}>
                        <Text strong>Acceptance Date</Text>
                        <div style={{ marginTop: "8px" }}>
                          <Text style={{ color: "#1890ff" }}>
                            {selectedQuote.acceptanceDate}
                          </Text>
                        </div>
                      </div>
                      <div style={{ marginTop: "16px" }}>
                        <Text strong>Quote time</Text>
                        <div style={{ marginTop: "8px" }}>
                          <Text>{selectedQuote.quoteTime}</Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="bg-white rounded-2xl">
                  <Row gutter={24}>
                    <Col span={16}>
                      <div
                        style={{
                          border: "1px solid #f0f0f0",
                          borderRadius: "8px",
                          padding: "16px",
                        }}
                      >
                        <Table
                          dataSource={[
                            {
                              key: "1",
                              recipeName:
                                selectedQuote.recipeDetails?.name ||
                                "NPKC Recipe",
                              item:
                                selectedQuote.recipeDetails?.item || "20 Pcs",
                              weight:
                                selectedQuote.recipeDetails?.weight ||
                                "20 Tonnes",
                              price:
                                selectedQuote.recipeDetails?.price || "R400",
                              avatar: "/people/recipe.png?height=40&width=40",
                            },
                          ]}
                          columns={[
                            {
                              title: "Recipe Name",
                              dataIndex: "recipeName",
                              key: "recipeName",
                              render: (text: string, record: any) => (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                  }}
                                >
                                  <Avatar src={record.avatar} size={40} />
                                  <Text>{text}</Text>
                                </div>
                              ),
                            },
                            {
                              title: "Item",
                              dataIndex: "item",
                              key: "item",
                              align: "center",
                            },
                            {
                              title: "Weight",
                              dataIndex: "weight",
                              key: "weight",
                              align: "center",
                            },
                            {
                              title: "Price",
                              dataIndex: "price",
                              key: "price",
                              align: "center",
                              render: (price: string) => (
                                <Text style={{ color: "#52c41a" }}>
                                  {price}
                                </Text>
                              ),
                            },
                          ]}
                          pagination={false}
                          size="middle"
                          summary={() => (
                            <Table.Summary>
                              <Table.Summary.Row>
                                <Table.Summary.Cell index={0}>
                                  <Text style={{ color: "#1890ff" }}>
                                    1 Product
                                  </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                  <div style={{ textAlign: "center" }}>
                                    <Text style={{ color: "#1890ff" }}>
                                      20 Pcs
                                    </Text>
                                  </div>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                  <div style={{ textAlign: "center" }}>
                                    <Text style={{ color: "#1890ff" }}>
                                      20 tn
                                    </Text>
                                  </div>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                  <div style={{ textAlign: "center" }}>
                                    <Text style={{ color: "#1890ff" }}>
                                      R400
                                    </Text>
                                  </div>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                            </Table.Summary>
                          )}
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        style={{
                          border: "1px solid #f0f0f0",
                          borderRadius: "8px",
                          padding: "16px",
                        }}
                      >
                        <Title level={5} style={{ marginBottom: "16px" }}>
                          Summary
                        </Title>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "12px",
                          }}
                        >
                          <Text>Subtotal</Text>
                          <Text>{selectedQuote.summary?.subtotal}</Text>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text>Freight & Logistics</Text>
                            <Text>{selectedQuote.summary?.freight}</Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Freight based on rate, weight and distance
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "16px",
                          }}
                        >
                          <Text style={{ color: "#1890ff" }}>
                            Adjust Points
                          </Text>
                          <Text style={{ color: "#1890ff" }}>
                            {selectedQuote.summary?.adjustPoints}
                          </Text>
                        </div>
                        <Divider />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text strong>Total</Text>
                          <Text strong style={{ color: "#52c41a" }}>
                            {selectedQuote.summary?.total}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </Modal>
        </ConfigProvider>
      </div>
    </div>
  );
}
