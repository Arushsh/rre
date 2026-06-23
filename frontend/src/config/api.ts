// Centralized API base URLs — pulled from environment variables
// In dev: uses .env (localhost)
// In production: uses .env.production (Render URLs)

export const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';
export const AI_URL = (import.meta as any).env.VITE_AI_URL || 'http://localhost:8000';
export const RAZORPAY_KEY_ID = (import.meta as any).env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
