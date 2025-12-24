import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  onSearch: (value: string) => void;
  initialValue?: string;
}

export const CropSearch: React.FC<Props> = ({
  onSearch,
  initialValue = "",
}) => {
  const [localValue, setLocalValue] = useState(initialValue);
  const debouncedValue = useDebounce(localValue, 500);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, initialValue]);

  return (
    <div className="w-full md:w-96">
      <Input
        placeholder="Search 1M+ records..."
        prefix={<SearchOutlined className="text-gray-400" />}
        size="large"
        allowClear
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
};
