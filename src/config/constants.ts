
// Configuration constants for the application
export const CONFIG = {
  // Google Maps API configuration
  GOOGLE_MAPS_API_KEY: '',
  
  // Database configuration
  DATABASE_TYPE: 'mysql',
  
  // SMTP configuration (to be set by admin)
  SMTP_SETTINGS: {
    host: '',
    port: 587,
    secure: false,
    user: '',
    password: '',
    from: ''
  },
  
  // Office hours configuration
  OFFICE_HOURS: {
    start: 9,
    end: 18
  }
};
