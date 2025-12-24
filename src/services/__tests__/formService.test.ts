import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formService } from '../formService';
import { apiClient } from '../apiClient';

vi.mock('../apiClient');

describe('Form Submission and Validation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Successful Submission', () => {
        it('should submit complete form with all fields', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

            const formData = {
                fullName: 'John Doe',
                email: 'john@example.com',
                password: 'SecurePass123',
                phone: '1234567890',
                age: 30,
                website: 'https://example.com',
                bio: 'Software developer',
                country: 'USA',
                agreeTerms: true,
                contactMethod: 'both' as const,
            };

            await formService.submit(formData);

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/form/submit/',
                expect.objectContaining({
                    full_name: 'John Doe',
                    email: 'john@example.com',
                    password: 'SecurePass123',
                    phone: '1234567890',
                    age: 30,
                    website: 'https://example.com',
                    bio: 'Software developer',
                    country: 'USA',
                    agree_terms: true,
                    contact_method: 'both',
                })
            );
        });

        it('should submit minimal required fields only', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

            const formData = {
                fullName: 'Jane Doe',
                email: 'jane@example.com',
                password: 'Password123',
                agreeTerms: true,
                contactMethod: 'email' as const,
            };

            await formService.submit(formData);

            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/form/submit/',
                expect.objectContaining({
                    full_name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: 'Password123',
                    agree_terms: true,
                    contact_method: 'email',
                })
            );
        });
    });

    describe('Field Mapping', () => {
        it('should correctly map camelCase to snake_case', async () => {
            vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

            const formData = {
                fullName: 'Test',
                contactMethod: 'email' as const,
                agreeTerms: true,
                email: 'test@test.com',
                password: 'Pass123',
            };

            await formService.submit(formData);

            const payload = vi.mocked(apiClient.post).mock.calls[0][1];
            expect(payload).toHaveProperty('full_name');
            expect(payload).toHaveProperty('contact_method');
            expect(payload).toHaveProperty('agree_terms');
        });
    });

    describe('Error Handling', () => {
        it('should handle validation errors', async () => {
            vi.mocked(apiClient.post).mockRejectedValue(new Error('Validation error'));

            const formData = {
                fullName: 'Test',
                email: 'invalid-email',
                password: 'weak',
                agreeTerms: true,
                contactMethod: 'email' as const,
            };

            await expect(formService.submit(formData)).rejects.toThrow();
        });

        it('should handle network errors', async () => {
            vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

            const formData = {
                fullName: 'Test',
                email: 'test@test.com',
                password: 'Pass123',
                agreeTerms: true,
                contactMethod: 'email' as const,
            };

            await expect(formService.submit(formData)).rejects.toThrow('Network error');
        });
    });
});
