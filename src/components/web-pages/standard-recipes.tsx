"use client";
import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Space,
  Typography,
  Checkbox,
  Avatar,
  Row,
  Col,
  Form,
  Select,
  Upload,
  Progress,
  message,
  Popconfirm,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  CloseOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadProps, MenuProps } from "antd";
import CustomSearchInput from "../ui/CustomInput";
import { toast } from "sonner";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Recipe {
  key: string;
  recipeCode: number;
  name: string;
  components: string;
  weight: string;
  price: string;
  avatar: string;
  details?: {
    ingredients: string;
    description: string;
    componentBreakdown: {
      potassium: number;
      phosphorus: number;
      nitrogen: number;
    };
  };
}

const mockRecipes: Recipe[] = [
  {
    key: "1",
    recipeCode: 70,
    name: "NPKC Recipe 1",
    components: "28N+P+K+Zn+s",
    weight: "1 Tonnes",
    price: "R200.00",
    avatar: "/people/recipe.png?height=40&width=40",
    details: {
      ingredients: "chloride (KCI), sulfate (K2SO4), or nitrate (KNO3)",
      description:
        "nibh consectetur volutpat at, nibh viverra massa Nam placerat elit. non efficitur. vitae luctus at ultrices urna nisl felis, In Morbi nec Nunc non orci elit leo. sit at, gravida at, est. Nullam Cras Nullam Ut elit. malesuada at, tincidunt quam fringilla convallis. nisl Lorem ultrices Nullam ullamcorper elementum",
      componentBreakdown: {
        potassium: 40,
        phosphorus: 20,
        nitrogen: 40,
      },
    },
  },
  {
    key: "2",
    recipeCode: 69,
    name: "Potassium nitrate...",
    components: "28N+P+K+Zn+s",
    weight: "10 Tonnes",
    price: "R1100.00",
    avatar: "/people/recipe.png?height=40&width=40",
    details: {
      ingredients: "urea (CO(NH2)2), ammonium sulfate",
      description:
        "High nitrogen content fertilizer suitable for various crops",
      componentBreakdown: {
        potassium: 10,
        phosphorus: 15,
        nitrogen: 75,
      },
    },
  },
  {
    key: "3",
    recipeCode: 68,
    name: "NPKC Recipe 2",
    components: "28N+P+K+Zn+s",
    weight: "20 Tonnes",
    price: "R1000.00",
    avatar: "/people/recipe.png?height=40&width=40",
    details: {
      ingredients: "monoammonium phosphate, sulfur",
      description: "Balanced fertilizer with phosphorus and sulfur",
      componentBreakdown: {
        potassium: 25,
        phosphorus: 45,
        nitrogen: 30,
      },
    },
  },
  {
    key: "4",
    recipeCode: 67,
    name: "NPKC Recipe 3",
    components: "28N+P+K+Zn+s",
    weight: "10 Tonnes",
    price: "R1000.00",
    avatar: "/people/recipe.png?height=40&width=40",
    details: {
      ingredients: "potassium chloride",
      description: "High potassium fertilizer for root development",
      componentBreakdown: {
        potassium: 80,
        phosphorus: 5,
        nitrogen: 15,
      },
    },
  },
  {
    key: "5",
    recipeCode: 66,
    name: "Potassium nitrate...",
    components: "28N+P+K+Zn+s",
    weight: "20 Tonnes",
    price: "R1000.00",
    avatar: "/people/recipe.png?height=40&width=40",
    details: {
      ingredients: "calcium ammonium nitrate",
      description: "Nitrogen fertilizer with calcium",
      componentBreakdown: {
        potassium: 20,
        phosphorus: 10,
        nitrogen: 70,
      },
    },
  },
  // ... (add more mock recipes as needed, up to 10 as shown in the screenshot)
];

export default function StandardRecipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [form] = Form.useForm();

  const handleInfoClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsInfoModalVisible(true);
  };

  const handleEditClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    form.setFieldsValue({
      name: recipe.name,
      components: recipe.components,
      weight: recipe.weight,
      price: recipe.price.replace("R", ""),
      ingredients: recipe.details?.ingredients,
      description: recipe.details?.description,
      potassium: recipe.details?.componentBreakdown.potassium,
      phosphorus: recipe.details?.componentBreakdown.phosphorus,
      nitrogen: recipe.details?.componentBreakdown.nitrogen,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (recipe: Recipe) => {
    setRecipes(recipes.filter((item) => item.key !== recipe.key));
    message.success(`${recipe.name} has been deleted successfully`);
  };

  const handleAddRecipe = () => {
    form.resetFields();
    setSelectedRecipe(null);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = (values: any) => {
    if (selectedRecipe) {
      const updatedRecipes = recipes.map((recipe) =>
        recipe.key === selectedRecipe.key
          ? {
              ...recipe,
              name: values.name,
              components: values.components,
              weight: values.weight,
              price: `R${values.price}`,
              details: {
                ...recipe.details!,
                ingredients: values.ingredients,
                description: values.description,
                componentBreakdown: {
                  potassium: values.potassium,
                  phosphorus: values.phosphorus,
                  nitrogen: values.nitrogen,
                },
              },
            }
          : recipe
      );
      setRecipes(updatedRecipes);
      message.success("Recipe updated successfully");
    } else {
      const newRecipe: Recipe = {
        key: Date.now().toString(),
        recipeCode: Math.floor(Math.random() * 100) + 50,
        name: values.name,
        components: values.components,
        weight: values.weight,
        price: `R${values.price}`,
        avatar: "/placeholder.svg?height=40&width=40",
        details: {
          ingredients: values.ingredients,
          description: values.description,
          componentBreakdown: {
            potassium: values.potassium,
            phosphorus: values.phosphorus,
            nitrogen: values.nitrogen,
          },
        },
      };
      setRecipes([...recipes, newRecipe]);
      message.success("Recipe added successfully");
    }
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const uploadProps: UploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const recipeColumns: ColumnsType<Recipe> = [
    {
      title: "",
      dataIndex: "checkbox",
      width: 50,
      render: () => <Checkbox />,
    },
    {
      title: "Recipe Code",
      dataIndex: "recipeCode",
      key: "recipeCode",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar src={record.avatar} size={40} />
          <Text>{name}</Text>
        </div>
      ),
    },
    {
      title: "Components",
      dataIndex: "components",
      key: "components",
      width: 200,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: 120,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => handleInfoClick(record)}
            style={{ color: "#1890ff" }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
            style={{ color: "#52c41a" }}
          />
          <Popconfirm
            title="Delete Recipe"
            description="Are you sure you want to delete this recipe?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              style={{ color: "#ff4d4f" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchText.toLowerCase()) ||
      recipe.components.toLowerCase().includes(searchText.toLowerCase()) ||
      recipe.recipeCode.toString().includes(searchText)
  );

  const filterItems: MenuProps["items"] = [
    {
      key: "status",
      label: "Status",
      children: [
        { key: "status-locked", label: "Locked" },
        { key: "status-unlock", label: "Unlock" },
      ],
    },
  ];

  return (
    <div style={{ padding: "0 24px" }}>
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
            Standard Recipes
          </Title>
          <Space>
            <Button
              onClick={() => toast.info("Feature coming soon...")}
              icon={<FilePdfOutlined style={{ fontSize: "20px" }} />}
              style={{ color: "#52c41a", padding: "20px", borderRadius: "50%" }}
            />
            <CustomSearchInput
              searchText={searchText}
              setSearchText={setSearchText}
              setCurrentPage={() => {}} // Placeholder, not used here
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
            <Button
              onClick={handleAddRecipe}
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
              Add Fertilizer
            </Button>
          </Space>
        </div>

        <Table
          columns={recipeColumns}
          dataSource={filteredRecipes}
          pagination={{
            total: filteredRecipes.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          size="middle"
        />

        {/* Info Modal */}
        <Modal
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Fertilizer Details</span>
              <Button
                icon={<CloseOutlined />}
                type="text"
                onClick={() => setIsInfoModalVisible(false)}
              />
            </div>
          }
          open={isInfoModalVisible}
          onCancel={() => setIsInfoModalVisible(false)}
          footer={null}
          width={600}
          closeIcon={null}
        >
          {selectedRecipe && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <Avatar src={selectedRecipe.avatar} size={80} />
                <div>
                  <Title level={4} style={{ margin: 0, marginBottom: "8px" }}>
                    {selectedRecipe.name}
                  </Title>
                  <Text style={{ color: "#52c41a", fontSize: "16px" }}>
                    {selectedRecipe.components}
                  </Text>
                </div>
              </div>

              <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col span={12}>
                  <Text type="secondary">Weight:</Text>
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      {selectedRecipe.weight.split(" ")[0]} tn
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Price:</Text>
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      {selectedRecipe.price.replace(".00", "")}
                    </Text>
                  </div>
                </Col>
              </Row>

              <div style={{ marginBottom: "24px" }}>
                <Title level={5}>Components</Title>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <Text>Potassium (K)</Text>
                    <Text>
                      {selectedRecipe.details?.componentBreakdown.potassium}%
                    </Text>
                  </div>
                  <Progress
                    percent={
                      selectedRecipe.details?.componentBreakdown.potassium
                    }
                    showInfo={false}
                  />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <Text>Phosphorus (P)</Text>
                    <Text>
                      {selectedRecipe.details?.componentBreakdown.phosphorus}%
                    </Text>
                  </div>
                  <Progress
                    percent={
                      selectedRecipe.details?.componentBreakdown.phosphorus
                    }
                    showInfo={false}
                  />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <Text>Nitrogen (N)</Text>
                    <Text>
                      {selectedRecipe.details?.componentBreakdown.nitrogen}%
                    </Text>
                  </div>
                  <Progress
                    percent={
                      selectedRecipe.details?.componentBreakdown.nitrogen
                    }
                    showInfo={false}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <Title level={5}>Ingredients</Title>
                <Text>{selectedRecipe.details?.ingredients}</Text>
              </div>

              <div>
                <Title level={5}>Details</Title>
                <Text type="secondary">
                  {selectedRecipe.details?.description}
                </Text>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit/Add Modal */}
        <Modal
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{selectedRecipe ? "Edit" : "Add"} Fertilizer</span>
              <Button
                icon={<CloseOutlined />}
                type="text"
                onClick={() => setIsEditModalVisible(false)}
              />
            </div>
          }
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
          width={1000}
          closeIcon={null}
        >
          <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter name" }]}
                >
                  <Input placeholder="NPKC Recipe 1" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ marginBottom: "16px" }}>
                      <Text strong>1 Tonne Sling</Text>
                      <Form.Item
                        name="price1Tonne"
                        style={{ marginTop: "8px" }}
                      >
                        <Input placeholder="R200" />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: "16px" }}>
                      <Text strong>2 Tonne Sling</Text>
                      <Form.Item
                        name="price2Tonne"
                        style={{ marginTop: "8px" }}
                      >
                        <Input placeholder="R200" />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: "16px" }}>
                      <Text strong>1 Pallet</Text>
                      <Form.Item
                        name="price1Pallet"
                        style={{ marginTop: "8px" }}
                      >
                        <Input placeholder="R200" />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Skoon Price" name="skoonPrice">
                      <Input placeholder="R200" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Mengsel Price" name="mengselPrice">
                      <Input placeholder="R200" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Weight"
                  name="weight"
                  rules={[{ required: true, message: "Please select weight" }]}
                >
                  <Select placeholder="1 tn">
                    <Option value="1 Tonnes">1 Tonnes</Option>
                    <Option value="5 Tonnes">5 Tonnes</Option>
                    <Option value="10 Tonnes">10 Tonnes</Option>
                    <Option value="20 Tonnes">20 Tonnes</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Ingredients" name="ingredients">
                  <TextArea
                    rows={3}
                    placeholder="chloride (KCI), sulfate (K2SO4), or nitrate (KNO3)"
                  />
                </Form.Item>

                <Form.Item label="Details" name="description">
                  <TextArea
                    rows={4}
                    placeholder="Enter detailed description..."
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Profile Picture">
                  <div
                    style={{
                      border: "2px dashed #d9d9d9",
                      borderRadius: "8px",
                      padding: "40px",
                      textAlign: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <Upload {...uploadProps} showUploadList={false}>
                      <div>
                        <UploadOutlined
                          style={{
                            fontSize: "32px",
                            color: "#d9d9d9",
                            marginBottom: "16px",
                          }}
                        />
                        <div>
                          <Text>Upload Image</Text>
                        </div>
                      </div>
                    </Upload>
                  </div>
                </Form.Item>

                <div
                  style={{
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Title level={5} style={{ margin: 0 }}>
                      Components
                    </Title>
                    <Button
                      size="small"
                      style={{ backgroundColor: "#8b4513", color: "white" }}
                    >
                      Poppins
                    </Button>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Text>Potassium (K)</Text>
                      <Form.Item name="potassium" style={{ margin: 0 }}>
                        <Input suffix="%" style={{ width: "80px" }} />
                      </Form.Item>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Text>Phosphorus (P)</Text>
                      <Form.Item name="phosphorus" style={{ margin: 0 }}>
                        <Input suffix="%" style={{ width: "80px" }} />
                      </Form.Item>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Text>Nitrogen (N)</Text>
                      <Form.Item name="nitrogen" style={{ margin: 0 }}>
                        <Input suffix="%" style={{ width: "80px" }} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ textAlign: "right", marginTop: "24px" }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ backgroundColor: "#52c41a" }}
              >
                Save & Change
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
