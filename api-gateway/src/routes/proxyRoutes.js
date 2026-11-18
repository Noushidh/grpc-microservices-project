import { createProxyMiddleware } from "http-proxy-middleware";

const handleProxyError = (err, req, res) => {
  console.error("========== PROXY ERROR ==========");
  console.error("Message:", err.message);
  console.error("Code:", err.code);
  console.error("URL:", req.originalUrl);
  console.error("Stack:", err.stack);
  console.error("=================================");

  if (res.headersSent) return;

  res.writeHead(503, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      success: false,
      message: "Service unavailable",
    }),
  );
};

export const authProxy = createProxyMiddleware({
  target: "http://user-service:5001",
  changeOrigin: true,
  pathRewrite: (path) => `/auth${path}`,
  on: {
    error: handleProxyError,
  },
});

export const userProxy = createProxyMiddleware({
  target: "http://user-service:5001",
  changeOrigin: true,
  pathRewrite: (path) => `/users${path}`,
  on: {
    error: handleProxyError,
  },
});

export const orderProxy = createProxyMiddleware({
  target: "http://order-service:5002",
  changeOrigin: true,
  pathRewrite: (path) => `/orders${path}`,
  on: {
    error: handleProxyError,
  },
});
