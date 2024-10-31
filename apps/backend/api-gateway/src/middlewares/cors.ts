import cors from "cors";
const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:3000", //frontend allowed domains/ports
  credentials: true, // Request includes credentials like cookies
  //Allows requests to include credentials like cookies, authorization headers, or TLS client certificates.
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
};

// console.log("corsOption:", corsOptions);

export default corsOptions;
