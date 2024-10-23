import express, { Request, Response, NextFunction } from "express";
// import { createProxyMiddleware, Options } from "http-proxy-middleware";
// import { customeLogger } from "./utils/logger";
import applyProxy from "./middlewares/proxy";
import cookieParser from "cookie-parser";
// import corsOptions from "./middlewares/cors";
import cors from "cors";
// import { authToken, routeConfigMiddleware } from "./middlewares/auth";
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
// app.use(routeConfigMiddleware);
// app.use(authToken);

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
        "eyJraWQiOiJqVkV4N3hYbFNvU1VPQkI4MXZnS3c5OEpHcFF3ZTBBeWJmZHFhaHVBVG5BPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NDI4YTQ1OC1iMGExLTcwOGUtOTI0My03YTJkMDIzMzczZDYiLCJjb2duaXRvOmdyb3VwcyI6WyJ1c2VyIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0gwa0pEVXRkYiIsImNsaWVudF9pZCI6IjMzcmQ1NTc2c3BvMmFxMWtjdXRicjI0a2JmIiwib3JpZ2luX2p0aSI6IjAyMDU0MTMzLWI1MWMtNGIxNS04MGQyLWYxZTQ3NDU1NTRhOCIsImV2ZW50X2lkIjoiMDQ2OTk3ZWItNzAyNS00ZDQxLWIwYjMtOGFkMGNmZDdmNTJkIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTcyOTU4NjM1NCwiZXhwIjoxNzI5NTg5OTU0LCJpYXQiOjE3Mjk1ODYzNTQsImp0aSI6ImFhYWYxNTY3LWQzOWUtNGQ3Ny05NGIwLWVhMWI5ODBlZDVlMSIsInVzZXJuYW1lIjoia2ltaGFiIn0.fxf2EJh5y1UX-jQhl3Tq0xhU0dDr1AN5ElFaZCBLVjD0_bGDY1QDYcqes-JjzUhWoy3xVCSHfNcyO4Mf0mY6k_tniSdZSVRNDFcWJPIf-duDHVTXwTqbOaiE2nj_6PeyuCiClAjSJtX9PDzl8ttxTTAvlhFx19GBXRz6yhW8fVSknS921ZH8mgwlHkN4mY7sjfFIBzX1rJeu4fvuNP6Ud3xAm5ApTBXWzZCI1tHoLBco5fi75xwX7fdGwuvgLzZfHmilHyTGEuyyfRPbPUR1lVGuqIILQD4i-fqChHfdwRC13ScUbKjkdFw1vnUDlnSFDynQYl_wwt4PK-CAQUkJJQ";
      // const payload = await checkVerifyToken(token);
      // const originCookie: CookieOptions = {
      //   httpOnly: true,
      //   sameSite: "none",
      //   maxAge: 1 * 60 * 60 * 1000, //1h
      // };
      const idToken =
        "eyJraWQiOiJjYlY2eXFOdUFSQlpqWGc2YUQzSUg3SnhOVXJSU1pHVHJEMWw2d3J1RlVjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4NDI4YTQ1OC1iMGExLTcwOGUtOTI0My03YTJkMDIzMzczZDYiLCJjb2duaXRvOmdyb3VwcyI6WyJ1c2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9IMGtKRFV0ZGIiLCJjb2duaXRvOnVzZXJuYW1lIjoia2ltaGFiIiwib3JpZ2luX2p0aSI6IjAyMDU0MTMzLWI1MWMtNGIxNS04MGQyLWYxZTQ3NDU1NTRhOCIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU5NzA4ODA1NTk3Mzpyb2xlXC9zZXJ2aWNlLXJvbGVcL2F1dGgtdGVzdCJdLCJhdWQiOiIzM3JkNTU3NnNwbzJhcTFrY3V0YnIyNGtiZiIsImV2ZW50X2lkIjoiMDQ2OTk3ZWItNzAyNS00ZDQxLWIwYjMtOGFkMGNmZDdmNTJkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3Mjk1ODYzNTQsImV4cCI6MTcyOTU4OTk1NCwiaWF0IjoxNzI5NTg2MzU0LCJqdGkiOiIzMzljZjI4MC04Yjc0LTRiN2QtOTBiMi1lOTI1MTM3MmM5NmEiLCJlbWFpbCI6ImtodW5raW1oYWI3QGdtYWlsLmNvbSJ9.QSFgov1yXpuMD8OoJhF5VZHEdNXhKvXjgJs1VgMS8Q56PMiPNGr5b4Sco82dyg3j856TE4IuOGHy8Hrl7_8D7yAf2oy1PMN0uG_FEk8pkghfyYAcaLI4fcba5IIQSl7txU3oWb1Ke7JID1kC2BUbOzvaBiyJm5CS6kmYqbkM6Vjx2Z6ysote-A8LwQvnX74m6Pzgkf31gkz0t9iP2pSYmyTT3qoVnLNY-QTaZ0xDZKFlq7GhY27mjRwN8rgTW436ErDsiBU0u_v6_9-QPwc_9ik2E0ptigWQ_cCZzM4IXk4yQzUHJ1OYDpUKqb6r3T20XT-EXfU6opjuZlGGtCzMOQ";

      res.cookie("token_access", token);
      res.cookie("token_id", idToken);

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
