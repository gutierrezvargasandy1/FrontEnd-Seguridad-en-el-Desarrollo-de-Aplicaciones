import { Environment } from './environment-interface';

export const environment: Environment = {
  production: false,
  
  apiUrl: 'http://localhost:3000/api',

  
  apiVersion: 'v1',
  timeout: 30000,        
  retryAttempts: 2,      
  
  features: {
    enableCache: false,    
    enableLogging: true,   
    enableMockData: false  
  },
  
  endpoints: {
    auth: '/auth',
    users: '/users',
    tasks: '/tasks'
  }
};