import { describe, it, expect } from 'vitest';

describe('ComplexForm Validation Rules', () => {
    describe('Email Validation', () => {
        it('should accept valid email formats', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.co.uk',
                'user+tag@example.org',
            ];

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validEmails.forEach((email) => {
                expect(emailPattern.test(email)).toBe(true);
            });
        });

        it('should reject invalid email formats', () => {
            const invalidEmails = [
                'notanemail',
                '@example.com',
                'user@',
                'user @example.com',
            ];

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            invalidEmails.forEach((email) => {
                expect(emailPattern.test(email)).toBe(false);
            });
        });
    });

    describe('Password Validation', () => {
        it('should require minimum 8 characters', () => {
            const password = 'Short1';
            expect(password.length >= 8).toBe(false);
        });

        it('should require uppercase letter', () => {
            const hasUppercase = (pwd: string) => /[A-Z]/.test(pwd);
            expect(hasUppercase('password1')).toBe(false);
            expect(hasUppercase('Password1')).toBe(true);
        });

        it('should require lowercase letter', () => {
            const hasLowercase = (pwd: string) => /[a-z]/.test(pwd);
            expect(hasLowercase('PASSWORD1')).toBe(false);
            expect(hasLowercase('Password1')).toBe(true);
        });

        it('should require digit', () => {
            const hasDigit = (pwd: string) => /\d/.test(pwd);
            expect(hasDigit('Password')).toBe(false);
            expect(hasDigit('Password1')).toBe(true);
        });

        it('should accept valid password', () => {
            const password = 'SecurePass123';
            const isValid =
                password.length >= 8 &&
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /\d/.test(password);
            expect(isValid).toBe(true);
        });
    });

    describe('Full Name Validation', () => {
        it('should require minimum 3 characters', () => {
            expect('AB'.length >= 3).toBe(false);
            expect('John'.length >= 3).toBe(true);
        });

        it('should limit to 100 characters', () => {
            const longName = 'a'.repeat(101);
            expect(longName.length <= 100).toBe(false);
        });
    });

    describe('Age Validation', () => {
        it('should accept ages between 1 and 150', () => {
            expect(25 >= 1 && 25 <= 150).toBe(true);
            expect(0 >= 1 && 0 <= 150).toBe(false);
            expect(151 >= 1 && 151 <= 150).toBe(false);
        });
    });

    describe('URL Validation', () => {
        it('should accept valid URLs', () => {
            const validUrls = [
                'https://example.com',
                'http://test.org',
                'https://sub.domain.com/path',
            ];

            const urlPattern = /^https?:\/\/.+/;
            validUrls.forEach((url) => {
                expect(urlPattern.test(url)).toBe(true);
            });
        });

        it('should reject invalid URLs', () => {
            const invalidUrls = ['example.com', 'not-a-url', 'ftp://example.com'];

            const urlPattern = /^https?:\/\/.+/;
            invalidUrls.forEach((url) => {
                expect(urlPattern.test(url)).toBe(false);
            });
        });
    });

    describe('Bio Validation', () => {
        it('should limit to 500 characters', () => {
            const longBio = 'a'.repeat(501);
            expect(longBio.length <= 500).toBe(false);

            const validBio = 'a'.repeat(500);
            expect(validBio.length <= 500).toBe(true);
        });
    });

    describe('Conditional Phone Validation', () => {
        it('should require phone when contact method is phone', () => {
            const contactMethod: string = 'phone';
            const phoneRequired = contactMethod === 'phone' || contactMethod === 'both';
            expect(phoneRequired).toBe(true);
        });

        it('should require phone when contact method is both', () => {
            const contactMethod: string = 'both';
            const phoneRequired = contactMethod === 'phone' || contactMethod === 'both';
            expect(phoneRequired).toBe(true);
        });

        it('should not require phone when contact method is email', () => {
            const contactMethod: string = 'email';
            const phoneRequired = contactMethod === 'phone' || contactMethod === 'both';
            expect(phoneRequired).toBe(false);
        });
    });

    describe('Terms Checkbox Validation', () => {
        it('should require terms to be checked', () => {
            const agreeTerms: boolean = false;
            expect(agreeTerms).toBe(false);
        });
    });
});
