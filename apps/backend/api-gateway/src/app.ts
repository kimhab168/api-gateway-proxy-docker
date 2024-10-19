import express from "express";
// import { createProxyMiddleware, Options } from "http-proxy-middleware";
// import { customeLogger } from "./utils/logger";
import applyProxy from "./middlewares/proxy";
import cookieParser from "cookie-parser";
import corsOptions from "./middlewares/cors";
import cors from "cors";
import { checkVerifyToken } from "./middlewares/auth";
// ========================
// Initialize App Express
// ========================
const app = express();

//====================
// Security Middleware
//====================
app.use(cookieParser());
app.use(cors(corsOptions));
// ========================
// Global Middleware
// ========================
app.use(express.json()); // Help to get the json from request body
//no need to use because of the services api has it, if we use it here again will duplicate express.json()

app.get(
  "/checkToken",
  async (
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    try {
      const token =
        "eyJraWQiOiJqVkV4N3hYbFNvU1VPQkI4MXZnS3c5OEpHcFF3ZTBBeWJmZHFhaHVBVG5BPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjNDU4NDRmOC0yMGYxLTcwNDMtZTRiMy00NjYxZGY5N2Q5NmYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9IMGtKRFV0ZGIiLCJjbGllbnRfaWQiOiIzM3JkNTU3NnNwbzJhcTFrY3V0YnIyNGtiZiIsIm9yaWdpbl9qdGkiOiJmZWIwZDdiMS01MWZlLTRmZjctODk4OS00ZjVjMDQzZTllZWIiLCJldmVudF9pZCI6IjEzMjZmYTM5LWUzMGEtNGJkMi1iZGNjLWE5MThjYTRlOTQzYiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjkzMDMyODgsImV4cCI6MTcyOTMwNjg4OCwiaWF0IjoxNzI5MzAzMjg4LCJqdGkiOiI1Yjk4MDAzNC0yOWNjLTQ3ZWQtYjA4ZC0yZWEzNjczMzlkMDYiLCJ1c2VybmFtZSI6ImtpbWhhYiJ9.L5hFfxe7oDTo53cDvSVnvtJ2wh5D4f3_oowrnVYw-5ZpLYJqzOkS5kFEecuzNZcLwIN1RX_QUAKxUVWX_t-ln9-D_Ycwt149MkllvQCOl3e-vgH6Z2ne19Io7xQO_rNxeHPtul5e0G6xPzhL_geohYXrkElpgksa7EMfWE45bY89t5yQ7RF6AUr_hOljehXmx7VI6b3X8HwY3iNCfNkJlk82AS1Yfnc8cvTvcGRIDy64eINGFNm8C-mYpFnEfy-I6tZ2Xm8iY02xQiH6KrDOtqBXbEH87WY1PNMU46oJ5BjH18L-w8aF68Aa7RHk6jyftThkw_EhEYlBVfyXyIt2nQ";

      const payload = await checkVerifyToken(token);

      res.status(200).send({
        message: "valid token",
        payload,
      });
    } catch (error) {
      console.log("invalid token", error);
      res.status(401).send({ message: "failed" });
    }
  }
);

// app.use((req, _res, next) => {
//   console.log(`Request Method: ${req.method} | Request URL: ${req.url}`);
//   customeLogger.log("info", "Successfull");
//   next();
// });
//Apply proxy as middleware
applyProxy(app);

// app.use(
//   "/product",
//   createProxyMiddleware(<Options>{
//     target: "http://product-service:4001/v2/product", // Microservice 1
//     changeOrigin: true,
//   })
// );

// app.use(
//   "/auth",
//   createProxyMiddleware({
//     target: "http://auth-service:4002/auth", // Microservice 2
//     changeOrigin: true,
//   })
// );
//=================
// AUTH Middleware
//=================

// ========================
// ERROR Handler / Global
// ========================

export default app;
