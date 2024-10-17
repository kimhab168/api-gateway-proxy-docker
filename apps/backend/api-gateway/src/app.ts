import express from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
// ========================
// Initialize App Express
// ========================
const app = express();

// ========================
// Global Middleware
// ========================
app.use(express.json()); // Help to get the json from request body

app.use((req, _res, next) => {
  console.log(`Request Method: ${req.method} | Request URL: ${req.url}`);
  next();
});

app.use(
  "/product",
  createProxyMiddleware(<Options>{
    target: "http://product-service:4001/v2/product", // Microservice 1
    changeOrigin: true,
  })
);

app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://auth-service:4002/auth", // Microservice 2
    changeOrigin: true,
  })
);
//=================
// AUTH Middleware
//=================

// ========================
// ERROR Handler
// ========================

export default app;
