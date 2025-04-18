const requestLogger = (req, res, next) => {
    const method = req.method;
    const path = req.originalUrl;
    const ip = req.ip;
    const timestamp = new Date().toISOString();
  
    console.log(`[${timestamp}] ${method} ${path} - IP: ${ip}`);
  
    next();
};
  
module.exports = requestLogger;
  