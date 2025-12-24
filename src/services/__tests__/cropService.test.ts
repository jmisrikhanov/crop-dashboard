import { describe, it, expect, vi } from 'vitest';
import { cropService } from '../cropService';
import { apiClient } from '../apiClient';

vi.mock('../apiClient');

describe('cropService', () => {
    it('should fetch crops with correct query parameters', async () => {
        const mockResponse = {
            data: {
                results: [{ id: 1, crop_name: 'Wheat' }],
                count: 100,
            },
        };

        vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

        const result = await cropService.fetchCrops({
            page: 2,
            pageSize: 25,
            searchTerm: 'wheat',
            sortField: 'crop_name',
            sortOrder: 'ascend',
            filters: { country: ['USA'] },
        });

        expect(apiClient.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/table/data/')
        );
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.stringContaining('page=2')
        );
        expect(apiClient.get).toHaveBeenCalledWith(
            expect.stringContaining('page_size=25')
        );
        expect(result.data).toEqual(mockResponse.data.results);
        expect(result.total).toBe(100);
    });

    it('should fetch crop details by ID', async () => {
        const mockCrop = {
            id: 1,
            crop_name: 'Wheat',
            variety: 'Winter',
            scientific_name: 'Triticum aestivum',
        };

        vi.mocked(apiClient.get).mockResolvedValue({ data: mockCrop });

        const result = await cropService.getCropById(1);

        expect(apiClient.get).toHaveBeenCalledWith('/api/crops/1/');
        expect(result).toEqual(mockCrop);
    });

    it('should fetch filter options from data', async () => {
        const mockResponse = {
            data: {
                results: [
                    { country: 'USA', crop_name: 'Wheat', status: 'growing' },
                    { country: 'Canada', crop_name: 'Corn', status: 'harvested' },
                ],
            },
        };

        vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

        const result = await cropService.fetchFilterOptions();

        expect(result.countries).toContain('USA');
        expect(result.countries).toContain('Canada');
        expect(result.crops).toContain('Wheat');
        expect(result.statuses).toContain('growing');
    });
});
