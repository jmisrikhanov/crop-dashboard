import React, { useEffect, useState } from "react";
import { Drawer, Descriptions, Tag, Divider, Typography, Spin, App } from "antd";
import {
  CalendarOutlined,
  GlobalOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined,
  EnvironmentOutlined,
  CloudOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import type { CropData, CropDetail } from "../types/";
import { cropService } from "../services/cropService";

const { Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  crop: CropData | null;
}

export const CropDetailDrawer: React.FC<Props> = ({ open, onClose, crop }) => {
  const { message } = App.useApp();
  const [detailedCrop, setDetailedCrop] = useState<CropDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && crop?.id) {
      setLoading(true);
      cropService
        .getCropById(crop.id)
        .then((data) => {
          setDetailedCrop(data);
        })
        .catch(() => {
          message.error("Failed to load full crop details.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setDetailedCrop(null);
    }
  }, [open, crop, message]);

  const displayData = detailedCrop || (crop as CropDetail);

  if (!displayData) return null;

  const safeFormatNumber = (val: number | string | null | undefined) => {
    if (val === null || val === undefined) return "-";
    return val.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "harvested":
        return "green";
      case "failed":
        return "red";
      case "growing":
        return "cyan";
      case "planted":
        return "blue";
      default:
        return "default";
    }
  };

  return (
    <Drawer
      title={
        <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
          Crop Details
        </span>
      }
      placement="right"
      onClose={onClose}
      open={open}
      size="large"
      className="dark:bg-gray-900"
    >
      {loading && !detailedCrop ? (
        <div className="flex flex-col h-full items-center justify-center gap-4">
          <Spin size="large" />
          <span className="text-gray-500 dark:text-gray-400">Loading details...</span>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg text-center border border-green-100 dark:border-green-800">
            <DeploymentUnitOutlined className="text-4xl text-green-600 dark:text-green-400 mb-2" />
            <Title level={3} className="!mb-1 dark:text-white">
              {displayData.crop_name}
            </Title>
            <div className="flex gap-2 justify-center mt-2">
              <Tag color="cyan">{displayData.variety}</Tag>
              {displayData.scientific_name && (
                <Tag color="purple" className="italic">
                  {displayData.scientific_name}
                </Tag>
              )}
            </div>
            <div className="mt-4">
              <Tag color={getStatusColor(displayData.status)} className="px-4 py-1 text-sm">
                {(displayData.status || "UNKNOWN").toUpperCase()}
              </Tag>
            </div>
          </div>

          <Descriptions
            column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}
            bordered
            size="middle"
            className="bg-white dark:bg-gray-800"
          >
            <Descriptions.Item label="ID">{displayData.id}</Descriptions.Item>
            <Descriptions.Item label="Field ID">
              {displayData.field_id || "-"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <GlobalOutlined /> Country
                </span>
              }
            >
              {displayData.country}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <GlobalOutlined /> Region
                </span>
              }
            >
              {displayData.region} (Lat: {displayData.latitude || "-"}, Long:{" "}
              {displayData.longitude || "-"})
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <ExperimentOutlined /> Yield
                </span>
              }
            >
              <span className="font-mono font-bold text-green-600">
                {safeFormatNumber(displayData.yield_amount)} kg/ha
              </span>
              {displayData.yield_quality_grade && (
                <span className="ml-2 text-xs text-gray-500">
                  (Grade: {displayData.yield_quality_grade})
                </span>
              )}
            </Descriptions.Item>
          </Descriptions>

          <Divider><EnvironmentOutlined /> Growing Conditions</Divider>
          <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} bordered size="small">
            <Descriptions.Item label="Soil Type">{displayData.soil_type || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Irrigation">{displayData.irrigation_type || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Season">{displayData.growing_season || "N/A"}</Descriptions.Item>
            <Descriptions.Item label={<span className="text-blue-500"><CloudOutlined /> Rainfall</span>}>
              {displayData.total_rainfall_mm ? `${displayData.total_rainfall_mm} mm` : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={<span className="text-orange-500">Avg Temp</span>}>
              {displayData.avg_temperature_c ? `${displayData.avg_temperature_c} °C` : "-"}
            </Descriptions.Item>
          </Descriptions>

          <Divider><MedicineBoxOutlined /> Treatments & Care</Divider>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Fertilizer">
              {displayData.fertilizer_type}
              {displayData.fertilizer_amount_kg && ` (${displayData.fertilizer_amount_kg} kg)`}
            </Descriptions.Item>
            <Descriptions.Item label="Pesticide Applied?">
              {displayData.pesticide_applied ? (
                <Tag color="red">Yes - {displayData.pesticide_type || "Unknown Type"}</Tag>
              ) : (
                <Tag color="green">No</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>

          <Divider><CalendarOutlined /> Timeline</Divider>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <div className="text-xs text-gray-500">Planting Date</div>
              <div className="font-medium">{displayData.planting_date || "-"}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <div className="text-xs text-gray-500">Exp. Harvest</div>
              <div className="font-medium">{displayData.expected_harvest_date || "-"}</div>
            </div>
            {displayData.actual_harvest_date && (
              <div className="col-span-2 bg-green-50 dark:bg-green-900/20 p-3 rounded border border-green-200">
                <div className="text-xs text-green-600">Actual Harvest Date</div>
                <div className="font-medium">{displayData.actual_harvest_date}</div>
              </div>
            )}
          </div>


          {displayData.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded text-sm text-gray-600 dark:text-gray-300 border border-yellow-200">
              <div className="font-bold mb-1">Researcher Notes</div>
              {displayData.notes}
            </div>
          )}

          <div className="text-xs text-gray-400 text-right">
            Verified by: {displayData.researcher_name || "Unknown"}
          </div>
        </div>
      )}
    </Drawer>
  );
};
