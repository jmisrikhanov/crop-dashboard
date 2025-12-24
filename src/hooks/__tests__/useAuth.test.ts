import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { authService } from '../../services/authService';
import { STORAGE_KEYS } from '../../constants';

// Mock dependencies
vi.mock('../../services/authService');
vi.mock('antd', () => ({
    App: {
        useApp: () => ({ message: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }),
    },
}));

describe('useAuth Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should login successfully and store tokens', async () => {
        const mockResponse = {
            access: 'access-token',
            refresh: 'refresh-token',
            user: { id: 1, username: 'testuser', email: 'test@test.com', first_name: 'Test', last_name: 'User' },
        };

        vi.mocked(authService.login).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            const success = await result.current.login({ username: 'testuser', password: 'password' });
            expect(success).toBe(true);
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
        expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN, 'refresh-token');
        expect(result.current.user).toEqual(mockResponse.user);
    });

    it('should logout and clear auth data', async () => {
        vi.mocked(authService.logout).mockResolvedValue();

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.logout();
        });

        expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
        expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
        expect(result.current.user).toBeNull();
    });

    it('should load user from localStorage on mount', async () => {
        const mockUser = { id: 1, username: 'testuser', email: 'test@test.com', first_name: 'Test', last_name: 'User' };

        vi.mocked(localStorage.getItem).mockReturnValue('access-token');
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

        const { result } = renderHook(() => useAuth());

        await waitFor(() => {
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
        });
    });

    it('should handle login failure', async () => {
        vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'));

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            const success = await result.current.login({ username: 'wrong', password: 'wrong' });
            expect(success).toBe(false);
            expect(result.current.isAuthenticated).toBe(false);
        });
    });
});
