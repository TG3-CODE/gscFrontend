const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://gsc-backend-production-9009.up.railway.app'
    : 'http://localhost:3000'
};

export default config;
