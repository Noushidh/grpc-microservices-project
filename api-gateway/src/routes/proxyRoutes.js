import { createProxyMiddleware } from "http-proxy-middleware";

const handleProxyError = (err, req, res) => {
  console.error("Proxy Error:", err.message);
  if (res.headersSent) {
    return;
  }
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

export const userProxy = createProxyMiddleware({
  target: "http://localhost:5001",
  changeOrigin: true,
  pathRewrite: (path, req) => req.originalUrl.replace(/^\/api/, ""),
  on: {
    error: handleProxyError,
  },
});

export const orderProxy = createProxyMiddleware({
  target: "http://localhost:5002",
  changeOrigin: true,
  pathRewrite: (path, req) => req.originalUrl.replace(/^\/api/, ""),
  on: {
    error: handleProxyError,
  },
});
