import React from "react";
import { Input, InputProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface CustomSearchInputProps extends InputProps {
  searchText: string;
  setSearchText: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
  searchText,
  setSearchText,
  //   setCurrentPage,
  ...rest
}) => {
  return (
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
        // setCurrentPage(1);
      }}
      style={{ width: 350, padding: "4px 6px", borderRadius: "30px" }}
      {...rest}
    />
  );
};

export default CustomSearchInput;
