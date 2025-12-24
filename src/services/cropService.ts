import { apiClient } from "./apiClient";
import type { CropData, CropDetail } from "../types/";
import { message } from "antd";

export interface FetchParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  sortField?: string;
  sortOrder?: "ascend" | "descend" | null;
  filters?: Record<string, any>;
}

export interface FetchResponse {
  data: CropData[];
  total: number;
}

export const cropService = {
  fetchCrops: async (params: FetchParams): Promise<FetchResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append("page", params.page.toString());
    queryParams.append("page_size", params.pageSize.toString());

    if (params.searchTerm) {
      queryParams.append("search", params.searchTerm);
    }

    if (params.sortField && params.sortOrder) {
      const prefix = params.sortOrder === "descend" ? "-" : "";
      queryParams.append("ordering", `${prefix}${params.sortField}`);
    }

    if (params.filters) {
      Object.keys(params.filters).forEach((key) => {
        const value = params.filters![key];
        if (value && value.length > 0) {
          queryParams.append(
            key,
            Array.isArray(value) ? value.join(",") : value
          );
        }
      });
    }

    const response = await apiClient.get(
      `/api/table/data/?${queryParams.toString()}`
    );

    return {
      data: response.data.results,
      total: response.data.count,
    };
  },

  getCropById: async (id: string | number): Promise<CropDetail> => {
    const response = await apiClient.get(`/api/crops/${id}/`);
    return response.data;
  },

  fetchFilterOptions: async (): Promise<{
    countries: string[];
    crops: string[];
    statuses: string[];
  }> => {
    try {
      const dataResponse = await apiClient.get(
        "/api/table/data/?page_size=100"
      );

      const rows = Array.isArray(dataResponse.data)
        ? dataResponse.data
        : dataResponse.data.results || [];

      const countries = Array.from(
        new Set(rows.map((r: CropData) => r.country))
      ).filter(Boolean) as string[];
      const crops = Array.from(
        new Set(rows.map((r: CropData) => r.crop_name))
      ).filter(Boolean) as string[];
      const statuses = Array.from(
        new Set(rows.map((r: CropData) => r.status))
      ).filter(Boolean) as string[];

      return { countries, crops, statuses };
    } catch (error) {
      message.warning("Failed to fetch filter options.");
      return {
        countries: [],
        crops: [],
        statuses: [],
      };
    }
  },
};
