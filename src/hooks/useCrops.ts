import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { cropService } from "../services/cropService";
import type { CropData } from "../types/";
import { App } from "antd";
import type { TablePaginationConfig } from "antd";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

export const useCrops = () => {
  const { message } = App.useApp();
  const [data, setData] = useState<CropData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [cropOptions, setCropOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  const lastRequestId = useRef(0);

  useEffect(() => {
    cropService.fetchFilterOptions().then(({ countries, crops, statuses }) => {
      setCountryOptions(countries);
      setCropOptions(crops);
      setStatusOptions(statuses);
    });
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const searchTerm = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || undefined;
  const sortOrder =
    (searchParams.get("sortOrder") as "ascend" | "descend") || null;

  const getFiltersFromURL = () => {
    const filters: Record<string, any> = {};
    ["country", "status", "crop_name"].forEach((key) => {
      const val = searchParams.get(key);
      if (val) filters[key] = val.split(",");
    });
    return filters;
  };

  const filters = getFiltersFromURL();

  const fetchData = useCallback(async () => {
    const requestId = ++lastRequestId.current;
    setLoading(true);
    try {
      const response = await cropService.fetchCrops({
        page,
        pageSize,
        searchTerm,
        sortField,
        sortOrder,
        filters,
      });
      if (requestId === lastRequestId.current) {
        setData(response.data);
        setTotal(response.total);
      }
    } catch (err) {
      if (requestId === lastRequestId.current) {
        message.error("Failed to load data");
      }
    } finally {
      if (requestId === lastRequestId.current) {
        setLoading(false);
      }
    }
  }, [
    page,
    pageSize,
    searchTerm,
    sortField,
    sortOrder,
    JSON.stringify(filters),
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      newFilters: Record<string, FilterValue | null>,
      sorter: SorterResult<CropData> | SorterResult<CropData>[]
    ) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", (pagination.current || 1).toString());
      params.set("pageSize", (pagination.pageSize || 10).toString());

      if (!Array.isArray(sorter) && sorter.field) {
        params.set("sortField", sorter.field as string);
        if (sorter.order) params.set("sortOrder", sorter.order);
        else {
          params.delete("sortField");
          params.delete("sortOrder");
        }
      }

      ["country", "status", "crop_name"].forEach((key) => params.delete(key));
      Object.keys(newFilters).forEach((key) => {
        const val = newFilters[key];
        if (val && val.length > 0) {
          params.set(key, val.join(","));
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
        params.set("page", "1");
      } else {
        params.delete("search");
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  return {
    data,
    total,
    loading,
    page,
    pageSize,
    searchTerm,
    handleTableChange,
    handleSearch,
    refresh: fetchData,
    countryOptions,
    cropOptions,
    statusOptions,
  };
};
