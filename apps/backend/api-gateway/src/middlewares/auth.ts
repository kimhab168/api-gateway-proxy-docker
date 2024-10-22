import config from "@/config";
import { ROUTE_PATH, RouteConfig } from "@/route-defs";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      currentUser: {
        username: string;
        role: string[] | undefined;
      };
      routeConfig: RouteConfig;
      methodConfig: {
        authRequired: boolean;
        roles?: string[];
      };
    }
  }
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: config.CLIENT_ID,
});

export const checkVerifyToken = async (token: string) => {
  try {
    const payload = await verifier.verify(token);
    console.log("payload: ", payload);

    return payload;
  } catch (error) {
    throw error;
  }
};

const findRouteConfig = (
  path: string,
  routeConfig: RouteConfig
): RouteConfig | null => {
  // const trimmedPath = path.replace(/\/+$/, "");
  // console.log("path: ", path);
  // console.log("trimmed: ", trimmedPath);
  // STEP 1: Split both the path and routeConfig path into segments
  const requestSegments = path.split("/").filter(Boolean);
  // console.log("requestSegment: ", requestSegments);
  // console.log("1");

  const routeSegments = routeConfig.path.split("/").filter(Boolean);
  // console.log("routeSegment: ", routeSegments);
  // STEP 2: Check if the number of segments match
  // console.log("2");
  if (routeSegments.length > requestSegments.length) {
    return null; // Path is too short to match this route
  }
  // STEP 3: Match route segments (considering dynamic segments like :productId)
  // console.log("3");
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const requestSegment = requestSegments[i];

    if (routeSegment.startsWith(":")) {
      // Dynamic segment, can be anything, so it matches
      continue;
    }

    if (routeSegment !== requestSegment) {
      return null; // Static segment mismatch
    }
  }
  // console.log("4");
  // STEP 4: If no nested routes, return the current routeConfig
  if (!routeConfig.nestedRoutes) {
    return routeConfig;
  }

  // STEP 5: Find the remaining path after matching the base path
  // console.log("5");
  const remainingPath = `/${requestSegments
    .slice(routeSegments.length)
    .join("/")}`;

  // STEP 6: Check if any nested routes match the remaining path
  // console.log("6");
  for (const nestedRouteConfig of routeConfig.nestedRoutes) {
    const nestedResult = findRouteConfig(remainingPath, nestedRouteConfig);
    if (nestedResult) {
      return nestedResult;
    }
  }

  // If no nested route matches, return the current routeConfig
  return routeConfig;
};
// Step 1: Find the route config for the requested path
// Step 2: Check if the route config has a method for the requested method
// Step 3: Attach the route configuration and method config to the request object
// TODO: implement the routeConfigMiddleware function
export const routeConfigMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // console.log("req: ", req);

  const { path, method } = req;
  // Step 1
  // console.log("path: ", path);

  let routeConfig = null;
  for (const key in ROUTE_PATH) {
    routeConfig = findRouteConfig(path, ROUTE_PATH[key]);
    if (routeConfig) break;
  }
  // console.log("routeConfig", routeConfig);

  if (!routeConfig) {
    return next(new Error("Route not found!"));
  }
  //STEP2:
  const methodConfig = routeConfig.method?.[method];
  if (!methodConfig) {
    return next(new Error("Method not found!"));
  }

  // Attach the route configuration and method config to the request object
  req.routeConfig = routeConfig;
  req.methodConfig = methodConfig;
  // console.log("req.routeConfig", routeConfig);
  // console.log("req.methodConfig", methodConfig);

  next();
};
export const routeConfigMiddlewareMe = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { path } = req;

  console.log("path: ", path);
  const trimmedPath = path.split("/");
  console.log("trimmedPath: ", trimmedPath);
  const newPath = trimmedPath.filter(Boolean);
  console.log("newPath: ", newPath);
  let my = false;
  for (const key in ROUTE_PATH) {
    let finding = check(ROUTE_PATH[key], newPath.length, newPath);
    console.log("check in auth/product route:", finding);
    if (finding) {
      my = true;
      break;
    }
  }
  if (my) return next();
  else next(new Error("No found Route"));
};
function check(objPath: RouteConfig, n: number, newPath: string[]): boolean {
  if (n === 1 && objPath.nestedRoutes) {
    return false;
  }

  if (
    objPath.path.split("/").filter(Boolean)[0] === newPath[newPath.length - n]
  ) {
    if (n > 1 && !objPath.nestedRoutes) {
      return false;
    }
    if (objPath.nestedRoutes && n !== 1) {
      return objPath.nestedRoutes.some((nestedRoute) =>
        check(nestedRoute, n - 1, newPath)
      );
      // return check(objPath.nestedRoutes, n - 1, newPath);
    } else {
      return true;
    }
  } else {
    return false;
  }
}
export const authToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { methodConfig } = req;
    console.log("methodConfig: ", methodConfig);
    if (methodConfig.authRequired) {
      // if (methodConfig.authRequired) {
      console.log(req.cookies);

      const token = req.cookies?.["token_access"];
      // if (!token) {
      //   next(new Error("Please Login to continue..."));
      // }
      console.log("Hello you has been passed!");
      console.log("token: ", token);
      const payload = await checkVerifyToken(token);
      console.log(payload);
    }
    next();

    // const payload = await verifier.verify(token);
    // if (!payload) {
    //   next(new Error("invalid token"));
    // }

    // next();
    // }
  } catch (error) {
    console.log("error: ", error);

    next(error);
  }
};
