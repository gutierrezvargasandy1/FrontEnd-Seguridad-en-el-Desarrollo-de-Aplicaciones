// src/environments/environment.ts
import { Environment } from './environment-interface';

export const environment: Environment = {
  production: false,
  
  // URL de tu API en desarrollo
  apiUrl: 'http://localhost:3000/api',

  
  apiVersion: 'v1',
  timeout: 30000,        // 30 segundos
  retryAttempts: 2,      // Reintentos automáticos
  
  features: {
    enableCache: false,    // Deshabilitar caché en desarrollo
    enableLogging: true,   // Logs detallados en consola
    enableMockData: false  // Mock data desactivada
  },
  
  endpoints: {
    auth: '/auth',
    users: '/users',
    tasks: '/tasks'
  }
};