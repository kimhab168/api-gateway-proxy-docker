// import config from "@/config";
const authTarget = "http://localhost:4002";
const productTarget = "http://localhost:4001/v2";
export interface RouteConfig {
  path: string;
  target?: string;
  method?: {
    [method: string]: {
      authRequired: boolean;
      roles?: string[]; //handle position of role on accessing
    };
  };
  nestedRoutes?: RouteConfig[] | undefined; //nested route as object
}
export interface RouteConfigs {
  [route: string]: RouteConfig;
}
export const ROUTE_PATH: RouteConfigs = {
  AUTH_SERVICE: {
    path: "/auth",
    target: authTarget,
    nestedRoutes: [
      //for handle validation of route
      {
        path: "/link",
        method: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/login",
        method: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/signup",
        method: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/confirmSignup",
        method: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/google",
        method: {
          POST: {
            authRequired: false,
          },
        },
      },
    ],
  },
  PRODUCT_SERVICE: {
    path: "/product",
    target: productTarget,
    method: {
      GET: {
        authRequired: true,
      },
    },
  },
};
