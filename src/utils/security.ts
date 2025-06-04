// Security utilities for input validation and sanitization

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  // Basic HTML sanitization - remove potentially dangerous tags and attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (French format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitizes numeric input
 */
export const sanitizeNumber = (input: string | number): number => {
  const num = typeof input === 'string' ? parseFloat(input.replace(/[^0-9.-]/g, '')) : input;
  return isNaN(num) ? 0 : num;
};

/**
 * Validates and sanitizes product data
 */
export const sanitizeProductData = (data: any) => {
  return {
    ...data,
    name: sanitizeHtml(data.name || ''),
    description: sanitizeHtml(data.description || ''),
    price: sanitizeNumber(data.price || 0),
    stock: sanitizeNumber(data.stock || 0)
  };
};

/**
 * Validates admin session with proper Supabase authentication
 */
export const validateAdminSession = (): boolean => {
  try {
    // Check if we have a valid authentication session
    const authData = sessionStorage.getItem('adminAuthData');
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    return parsed.authenticated && Date.now() < parsed.expires;
  } catch {
    return false;
  }
};

/**
 * Enhanced admin session validation with Supabase auth
 */
export const validateSupabaseAdminSession = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  } catch {
    return false;
  }
};

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 60000) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
}

// Global rate limiter for admin login attempts
export const adminLoginLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes
