// import config from "@/config";

export interface RouteConfig {
  path: string;
  target?: string;
  method?: {
    [method: string]: {
      authRequired: boolean;
      roles?: string[]; //handle position of role on accessing
    };
  };
  nestedRoutes?: RouteConfig[]; //nested route as object
}
export interface RouteConfigs {
  [route: string]: RouteConfig;
}
export const ROUTE_PATH: RouteConfigs = {
  AUTH_SERVICE: {
    path: "/auth",
    target: "http://auth-service:4002",
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
    path: "/v2/product",
    target: "http://product-service:4001",
  },
};
