"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, notification, Row, Col } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from "@ant-design/icons";
import { apiFetch } from "@/lib/api-fech";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function ContactUs() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await apiFetch("/contacts", {
        method: "POST",
        body: JSON.stringify(values),
      }, "client");

      notificationApi.success({
        message: "Message Sent Successfully",
        description: "Thank you for contacting us. We will get back to you shortly.",
        placement: "topRight",
      });
      form.resetFields();
    } catch (error: any) {
      notificationApi.error({
        message: "Failed to Send Message",
        description: error.message || "Something went wrong. Please try again later.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {contextHolder}
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Title level={1} className="!text-[#1a3c6e] !mb-4">Get in Touch</Title>
          <Paragraph className="text-gray-500 text-lg max-w-2xl mx-auto">
            Have questions about a property or our services? Our team is here to help you find your perfect home.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Contact Information */}
          <Col xs={24} lg={10}>
            <div className="!space-y-8">
              <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-[#1a3c6e]">
                    <MailOutlined className="text-xl" />
                  </div>
                  <div>
                    <Title level={5} className="!mb-1">Email Us</Title>
                    <Text className="text-gray-500">support@myhome.com</Text>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-xl text-green-600">
                    <PhoneOutlined className="text-xl" />
                  </div>
                  <div>
                    <Title level={5} className="!mb-1">Call Us</Title>
                    <Text className="text-gray-500">+44 (0)  XXX XXX XXX</Text>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                    <EnvironmentOutlined className="text-xl" />
                  </div>
                  <div>
                    <Title level={5} className="!mb-1">Our Office</Title>
                    <Text className="text-gray-500 text-sm leading-relaxed">
                      {/* 221B Baker Street, London<br /> */}
                      {/* NW1 6XE, United Kingdom */}
                      United Kingdom, London
                    </Text>
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card className="rounded-3xl border-none shadow-xl p-2 sm:p-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                className="space-y-2"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label={<span className="text-sm font-semibold text-gray-700">Full Name</span>}
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input placeholder="Enter your full name" size="large" className="!rounded-xl" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label={<span className="text-sm font-semibold text-gray-700">Email Address</span>}
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" }
                      ]}
                    >
                      <Input placeholder="Enter your email" size="large" className="!rounded-xl" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="subject"
                  label={<span className="text-sm font-semibold text-gray-700">Subject</span>}
                  rules={[{ required: true, message: "Please enter a subject" }]}
                >
                  <Input placeholder="How can we help?" size="large" className="!rounded-xl" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label={<span className="text-sm font-semibold text-gray-700">Your Message</span>}
                  rules={[{ required: true, message: "Please enter your message" }]}
                >
                  <TextArea 
                    placeholder="Tell us more about your inquiry..." 
                    rows={6} 
                    className="!rounded-xl !resize-none" 
                  />
                </Form.Item>

                <Form.Item className="!mb-0 pt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<SendOutlined />}
                    className="!bg-[#1a3c6e] !border-[#1a3c6e] !rounded-xl !h-12 !px-10 font-bold w-full sm:w-auto"
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}