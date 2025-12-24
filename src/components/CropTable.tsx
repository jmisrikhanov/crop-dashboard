import React from "react";
import { Table, Tag } from "antd";
import type { TablePaginationConfig } from "antd";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import type { CropData } from "../types/";

interface Props {
  data: CropData[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  countryOptions: string[];
  cropOptions: string[];
  statusOptions: string[];
  onChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<CropData> | SorterResult<CropData>[]
  ) => void;
  onRowClick?: (record: CropData) => void;
}

export const CropTable: React.FC<Props> = ({
  data,
  loading,
  total,
  page,
  pageSize,
  countryOptions,
  cropOptions,
  statusOptions,
  onChange,
  onRowClick,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
      width: 80,
      fixed: 'left' as const,
      render: (id: number) => <span style={{ whiteSpace: 'nowrap' }}>{id}</span>,
    },
    {
      title: "Crop",
      dataIndex: "crop_name",
      sorter: true,
      filters: cropOptions.map((c) => ({ text: c, value: c })),
      render: (text: string) => (
        <span className="font-medium text-green-700">{text}</span>
      ),
    },
    {
      title: "Variety",
      dataIndex: "variety",
      sorter: true,
    },
    {
      title: "Region",
      dataIndex: "region",
      sorter: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: true,
      filterSearch: true,
      filters: countryOptions.map((c) => ({ text: c, value: c })),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      filters: statusOptions.map((s) => ({
        text: s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
      })),
      render: (status: string) => {
        let color = "default";
        if (status === "harvested") color = "green";
        if (status === "failed") color = "volcano";
        if (status === "growing") color = "cyan";
        if (status === "planted") color = "blue";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "planting_date",
      sorter: true,
    },
    {
      title: "Yield (kg/ha)",
      dataIndex: "yield_amount",
      sorter: true,
      align: "right" as const,
      render: (val: number | null) => (
        <span>{val !== null ? val.toLocaleString() : "N/A"}</span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      onChange={onChange}
      locale={{ emptyText: loading ? null : undefined }}
      pagination={{
        current: page,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        pageSizeOptions: ["10", "25", "50", "100"],
        showTotal: (total) =>
          `Page ${page} of ${Math.ceil(
            total / pageSize
          )} (${total.toLocaleString()} records)`,
      }}
      onRow={(record) => ({
        onClick: () => onRowClick?.(record),
        className: "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700",
      })}
      scroll={{ x: 1000 }}
    />
  );
};
