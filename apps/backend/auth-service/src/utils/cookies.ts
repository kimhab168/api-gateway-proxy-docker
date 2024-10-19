import config from "@/config";
import { CookieOptions, Response } from "express";

interface CookiesType {
  token_id: string;
  token_access: string;
  refresh_token: string;
}

export const setCookies = (
  res: Response,
  token: CookiesType,
  options: CookieOptions = {}
) => {
  const originCookie: CookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "development",
    sameSite: config.NODE_ENV === "development" ? "none" : "lax",
    maxAge: 1 * 60 * 60 * 1000, //1h
    ...options,
  };

  for (const [key, value] of Object.entries(token)) {
    res.cookie(key, value, originCookie);
  }
};
