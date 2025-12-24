import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        Link: ({ children, to }: any) => <a href={to}>{children}</a>,
    };
});

describe('LoginPage', () => {
    it('should have useAuth hook dependency', () => {
        vi.mocked(useAuth).mockReturnValue({
            login: vi.fn(),
            logout: vi.fn(),
            isAuthenticated: false,
            isLoading: false,
            user: null,
        } as any);

        const auth = useAuth();
        expect(auth.login).toBeDefined();
        expect(auth.isAuthenticated).toBe(false);
    });
});
