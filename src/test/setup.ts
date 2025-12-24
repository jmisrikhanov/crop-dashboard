import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
    cleanup();
});

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
globalThis.localStorage = localStorageMock as any;

delete (window as any).location;
window.location = { href: '' } as any;

vi.mock('antd', async () => {
    const actual = await vi.importActual('antd');
    return {
        ...actual,
        ConfigProvider: ({ children }: any) => children,
    };
});

globalThis.console = {
    ...console,
    error: vi.fn(),
    warn: vi.fn(),
} as any;
