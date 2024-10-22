import express, { Request, Response, NextFunction } from "express";
// import { createProxyMiddleware, Options } from "http-proxy-middleware";
// import { customeLogger } from "./utils/logger";
import applyProxy from "./middlewares/proxy";
import cookieParser from "cookie-parser";
// import corsOptions from "./middlewares/cors";
import cors from "cors";
import { authToken, routeConfigMiddleware } from "./middlewares/auth";
// import { checkVerifyToken } from "./middlewares/auth";
// ========================
// Initialize App Express
// ========================
const app = express();

//====================
// Security Middleware
//====================
app.use(cookieParser());
app.use(cors());

app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("CORS-enabled for all origins");
});

//=================
// AUTH Middleware
//=================
app.use(routeConfigMiddleware);
app.use(authToken);

// app.use(cors(corsOptions));
// ========================
// Global Middleware
// ========================
// app.use(express.json()); // Help to get the json from request body
//no need to use because of the services api has it, if we use it here again will duplicate express.json()

app.get(
  "/checkToken",
  async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const token =
        "eyJraWQiOiJqVkV4N3hYbFNvU1VPQkI4MXZnS3c5OEpHcFF3ZTBBeWJmZHFhaHVBVG5BPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NDI4YTQ1OC1iMGExLTcwOGUtOTI0My03YTJkMDIzMzczZDYiLCJjb2duaXRvOmdyb3VwcyI6WyJ1c2VyIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0gwa0pEVXRkYiIsImNsaWVudF9pZCI6IjMzcmQ1NTc2c3BvMmFxMWtjdXRicjI0a2JmIiwib3JpZ2luX2p0aSI6ImFjNTVmZDIwLTNhOGYtNDM2ZC05MjkxLTVhMDdkYzJiOTg1OCIsImV2ZW50X2lkIjoiMDUzNjg0NDUtMzNlOS00YjQ5LWE4MmMtNGUzMTM0NjYyMTM0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTcyOTU3NDkxNywiZXhwIjoxNzI5NTc4NTE3LCJpYXQiOjE3Mjk1NzQ5MTcsImp0aSI6IjM3YjQ1MThkLWNlZmQtNGU4OC1hNTY0LTZkZjQxOWJjMDM0NyIsInVzZXJuYW1lIjoia2ltaGFiIn0.eGSkuuv5gMKTaFzww73jPQJ2_gAmKIHEhGukx4l7OHaAwHZTVAobh7LmruwSnEhAp8Cd6BGAwOQr_SNa34PrlLyFnzPtPDmNKwro1r7S0mCGUYsre9GaPTUqsr0vTg5F6OnjdUr34upHG97ypmVt0iS1uWtInJ6SczLts_NlKZYvGX5R4FWKukxeyUSWw8nCEREgCeBvX6YMO6MjdIV4_rd55NbsZiGHuIcLAbWg7dlu7vwd59_Z72Be3cqi1lg2G-1xSCue1bx0d6agILMUC4JI2KIw9SLB6WktUyoJwklRvcYtQqmOk9j_coIE-TzBnZylhQDVyh_a_2P2tAOrBA";
      // const payload = await checkVerifyToken(token);
      // const originCookie: CookieOptions = {
      //   httpOnly: true,
      //   sameSite: "none",
      //   maxAge: 1 * 60 * 60 * 1000, //1h
      // };

      res.cookie("token_access", token);

      res.status(200).send({
        message: "valid token",
        // payload,
      });
    } catch (error) {
      console.log("invalid token", error);
      res.status(401).send({ message: "failed" });
    }
  }
);

app.get("/test", (_req: Request, res: Response, _next: NextFunction) => {
  res.json({ message: "Healthy gateway" });
});

// app.use((req, _res, next) => {
//   console.log(`Request Method: ${req.method} | Request URL: ${req.url}`);
//   customeLogger.log("info", "Successfull");
//   next();
// });
//=========================
//Apply proxy as middleware
//=========================
applyProxy(app);

// app.use(
//   "/product",
//   createProxyMiddleware(<Options>{
//     target: "http://product-service:4001/v2/product", // Microservice 1
//     changeOrigin: true,
//   })
// );

// ========================
// ERROR Handler / Global
// ========================

export default app;
