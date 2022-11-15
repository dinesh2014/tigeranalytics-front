  export const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  export const env = process.env.NEXT_PUBLIC_ENV || 'LOCAL';
  export const secretKey =process.env.NEXT_PUBLIC_SECRET_CIPHER_KEY