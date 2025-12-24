import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCrops } from '../useCrops';
import { cropService } from '../../services/cropService';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

vi.mock('../../services/cropService');
vi.mock('antd', () => ({
    App: {
        useApp: () => ({ message: { success: vi.fn(), error: vi.fn() } }),
    },
}));

const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(BrowserRouter, null, children);

describe('useCrops - Data Fetching and Filtering', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch crops with pagination', async () => {
        const mockData = {
            data: [
                {
                    id: '1',
                    crop_name: 'Wheat',
                    variety: 'Winter',
                    country: 'USA',
                    status: 'growing' as const,
                    planting_date: '2024-01-01',
                    yield_amount: 1000,
                    region: 'Midwest',
                },
            ],
            total: 50,
        };

        vi.mocked(cropService.fetchCrops).mockResolvedValue(mockData);
        vi.mocked(cropService.fetchFilterOptions).mockResolvedValue({
            countries: ['USA'],
            crops: ['Wheat'],
            statuses: ['growing'],
        });

        const { result } = renderHook(() => useCrops(), { wrapper });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData.data);
        expect(result.current.total).toBe(50);
        expect(cropService.fetchCrops).toHaveBeenCalled();
    });

    it('should load filter options on mount', async () => {
        const mockOptions = {
            countries: ['USA', 'Canada'],
            crops: ['Wheat', 'Corn'],
            statuses: ['growing', 'harvested'],
        };

        vi.mocked(cropService.fetchFilterOptions).mockResolvedValue(mockOptions);
        vi.mocked(cropService.fetchCrops).mockResolvedValue({ data: [], total: 0 });

        const { result } = renderHook(() => useCrops(), { wrapper });

        await waitFor(() => {
            expect(result.current.countryOptions).toEqual(mockOptions.countries);
            expect(result.current.cropOptions).toEqual(mockOptions.crops);
            expect(result.current.statusOptions).toEqual(mockOptions.statuses);
        });
    });

    it('should handle API errors gracefully', async () => {
        vi.mocked(cropService.fetchCrops).mockRejectedValue(new Error('API Error'));
        vi.mocked(cropService.fetchFilterOptions).mockResolvedValue({
            countries: [],
            crops: [],
            statuses: [],
        });

        const { result } = renderHook(() => useCrops(), { wrapper });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual([]);
    });
});
