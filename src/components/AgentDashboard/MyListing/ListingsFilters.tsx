"use client";

import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

interface ListingsFiltersProps {
    search: string;
    status: string;
    onSearchChange: (val: string) => void;
    onStatusChange: (val: string) => void;
}

export default function ListingsFilters({
    search,
    status,
    onSearchChange,
    onStatusChange,
}: ListingsFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-200">
            <Input
                placeholder="Search by title or address"
                prefix={<SearchOutlined className="text-gray-400" />}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1"
                allowClear
            />
            <Select
                value={status}
                onChange={onStatusChange}
                className="w-full sm:w-44"
            >
                <Option value="all">All Status</Option>
                <Option value="PUBLISHED">Active</Option>
                <Option value="DRAFT">Draft</Option>
                <Option value="SOLD">Sold</Option>
            </Select>
        </div>
    );
}