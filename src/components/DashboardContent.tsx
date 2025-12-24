import { useState } from "react";
import { Card, Typography } from "antd";
import { CropTable } from "./CropTable";
import { CropSearch } from "./CropSearch";
import { CropDetailDrawer } from "./CropDetailDrawer";
import { useCrops } from "../hooks/useCrops";
import type { CropData } from "../types/";

const { Title } = Typography;

export const DashboardContent = () => {
    const {
        data,
        total,
        loading,
        page,
        pageSize,
        searchTerm,
        handleTableChange,
        handleSearch,
        countryOptions,
        cropOptions,
        statusOptions,
    } = useCrops();
    const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <Title level={3} className="!mb-0 dark:text-white">
                        Yield Overview
                    </Title>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {total.toLocaleString()} Records Found
                    </span>
                </div>
                <CropSearch onSearch={handleSearch} initialValue={searchTerm} />
            </div>
            <Card
                className="shadow-sm rounded-lg dark:bg-zinc-900 dark:border-zinc-800"
                styles={{ body: { padding: 0 } }}
            >
                <CropTable
                    data={data}
                    loading={loading}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    countryOptions={countryOptions}
                    cropOptions={cropOptions}
                    statusOptions={statusOptions}
                    onChange={handleTableChange}
                    onRowClick={(rec) => {
                        setSelectedCrop(rec);
                        setDrawerOpen(true);
                    }}
                />
            </Card>
            <CropDetailDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                crop={selectedCrop}
            />
        </div>
    );
};
