import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) {
        window.location.href = '/login';
        return null;
    }
    return children;
};

describe('ProtectedRoute', () => {
    it('should show loading state while checking authentication', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            user: null,
            login: vi.fn(),
            logout: vi.fn(),
        } as any);

        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render children when authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            user: { id: 1, username: 'test', email: 'test@test.com', first_name: 'Test', last_name: 'User' },
            login: vi.fn(),
            logout: vi.fn(),
        } as any);

        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect when not authenticated', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            login: vi.fn(),
            logout: vi.fn(),
        } as any);

        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        );

        expect(window.location.href).toBe('/login');
    });
});
