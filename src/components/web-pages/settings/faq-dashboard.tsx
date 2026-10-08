"use client";

import { useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Collapse,
  Checkbox,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  ConfigProvider,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

interface FAQItem {
  id: string;
  title: string;
  content: string;
  selected: boolean;
}

export default function FAQDashboard() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: "1",
      title: "Our Story",
      content:
        "convallis. Praesent felis, placerat Ut ac quis dui volutpat vitae elementum quis adipiscing malesuada tempor non ipsum non, nec vitae amet, Donec tincidunt efficitur. In In ipsum Cras turpis viverra laoreet ullamcorper placerat diam sed leo. faucibus vitae eget vitae vehicula, luctus id Lorem fringilla tempor faucibus ipsum Vestibulum tincidunt ullamcorper elit diam turpis placerat vitae Nunc vehicula, ex faucibus venenatis at, maximus commodo urna. Nam ex quis sit non vehicula, massa urna at",
      selected: false,
    },
    {
      id: "2",
      title: "When to use Doctor For You",
      content:
        "convallis. Praesent felis, placerat Ut ac quis dui volutpat vitae elementum quis adipiscing malesuada tempor non ipsum non, nec vitae amet, Donec tincidunt efficitur. In In ipsum Cras turpis viverra laoreet ullamcorper placerat diam sed leo. faucibus vitae eget vitae vehicula, luctus id Lorem fringilla tempor faucibus ipsum Vestibulum tincidunt ullamcorper elit diam turpis placerat vitae Nunc vehicula, ex faucibus venenatis at, maximus commodo urna. Nam ex quis sit non vehicula, massa urna at",
      selected: false,
    },
    {
      id: "3",
      title: "Our Mission",
      content:
        "convallis. Praesent felis, placerat Ut ac quis dui volutpat vitae elementum quis adipiscing malesuada tempor non ipsum non, nec vitae amet, Donec tincidunt efficitur. In In ipsum Cras turpis viverra laoreet ullamcorper placerat diam sed leo. faucibus vitae eget vitae vehicula, luctus id Lorem fringilla tempor faucibus ipsum Vestibulum tincidunt ullamcorper elit diam turpis placerat vitae Nunc vehicula, ex faucibus venenatis at, maximus commodo urna. Nam ex quis sit non vehicula, massa urna at",
      selected: false,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [form] = Form.useForm();

  const handleAddContent = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      title: item.title,
      content: item.content,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setFaqItems(faqItems.filter((item) => item.id !== id));
    message.success("FAQ item deleted successfully");
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingItem) {
        // Edit existing item
        setFaqItems(
          faqItems.map((item) =>
            item.id === editingItem.id
              ? { ...item, title: values.title, content: values.content }
              : item
          )
        );
        message.success("FAQ item updated successfully");
      } else {
        // Add new item
        const newItem: FAQItem = {
          id: Date.now().toString(),
          title: values.title,
          content: values.content,
          selected: false,
        };
        setFaqItems([...faqItems, newItem]);
        message.success("FAQ item added successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingItem(null);
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFaqItems(
      faqItems.map((item) =>
        item.id === id ? { ...item, selected: checked } : item
      )
    );
  };

  const renderFAQItem = (item: FAQItem) => (
    <div key={item.id} style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          border: "1px solid #e9ecef",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <Checkbox
          checked={item.selected}
          onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
          style={{ marginRight: 12, marginTop: 15 }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: 12,
              gap: 20,
            }}
          >
            <div className="w-full">
              <Title
                className="w-full shadow-md rounded-xl py-2 px-4"
                level={5}
                style={{ margin: 0, color: "#666", marginBottom: 9 }}
              >
                {item.title}
              </Title>
              <Paragraph
                className="w-full shadow-md rounded-xl py-2 px-4"
                style={{
                  margin: 0,
                  color: "#888",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {item.content}
              </Paragraph>
            </div>
            <Space direction="vertical" size={4}>
              <Button
                type="text"
                icon={<EditOutlined size={25} />}
                size="large"
                onClick={() => handleEdit(item)}
                style={{ color: "#666" }}
              />
              <Popconfirm
                title="Are you sure you want to delete this FAQ item?"
                onConfirm={() => handleDelete(item.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined size={25} />}
                  size="large"
                  style={{ color: "#666" }}
                />
              </Popconfirm>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout
      style={{
        margin: "0 24px",
        backgroundColor: "#fff",
        borderRadius: "24px",
        boxShadow: "0 2px 8px rgba(0, 0,0, 0.1)",
        padding: "24px ",
      }}
    >
      <Content style={{ padding: "16px " }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Title level={2} style={{ margin: 0, color: "#333" }}>
            FAQ
          </Title>
          <Button
            onClick={handleAddContent}
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
            Add Content
          </Button>
        </div>

        <div>{faqItems.map(renderFAQItem)}</div>

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
            title={editingItem ? "Edit FAQ Item" : "Add New FAQ Item"}
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            width={600}
            okText={editingItem ? "Update" : "Add"}
            
          >
            <Form form={form} layout="vertical" style={{ marginTop: 16, backgroundColor: "white", padding: "12px 24px", borderRadius: "16px" }}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input placeholder="Enter FAQ title" />
              </Form.Item>
              <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: "Please enter content" }]}
              >
                <TextArea rows={6} placeholder="Enter FAQ content" />
              </Form.Item>
            </Form>
          </Modal>
        </ConfigProvider>
      </Content>
    </Layout>
  );
}
