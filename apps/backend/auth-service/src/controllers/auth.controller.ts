import { loginWithGoogle } from "@/services/login-google.service";
import { Controller, Route, Get, Tags, Post, Body, Request } from "tsoa";
import express from "express";
import authService from "@/services/auth.service";
import { setCookies } from "@/utils/cookies";
interface SignUpType {
  username?: string;
  email: string;
  password: string;
}

interface VerifySignup {
  username: string;
  code: string;
}
interface SignIn {
  username: string;
  password: string;
}

@Route("/auth")
export class AuthController extends Controller {
  constructor() {
    super();
  }
  @Get("/link")
  @Tags("google link")
  public async getLink(): Promise<string> {
    try {
      return loginWithGoogle();
    } catch (error) {
      throw error;
    }
  }
  @Post("/signup")
  @Tags("SignUp")
  async signup(@Body() reqBody: SignUpType) {
    try {
      await authService.signup(reqBody);
      return {
        message: "Success Register!",
        required: "Please Confirm Verificatino",
      };
    } catch (error) {
      throw error;
    }
  }
  @Post("/confirm-signup")
  @Tags("Confirm SignUp")
  async confirmSignup(@Body() reqBody: VerifySignup) {
    try {
      await authService.confirmSignup(reqBody);
      //TODO: Save the user data to database
      return {
        message: "Success Verify! You can now Logged in",
      };
    } catch (error) {
      throw error;
    }
  }
  @Post("/login")
  @Tags("Login")
  async login(@Body() reqBody: SignIn, @Request() req: express.Request) {
    try {
      const tokens = await authService.login(reqBody);
      const tokenParams = {
        token_id: tokens?.IdToken!,
        token_access: tokens?.AccessToken!,
        refresh_token: tokens?.RefreshToken!,
      };
      const res = req.res as express.Response;
      // console.log(tokens);
      setCookies(res, tokenParams);
      return {
        message: "Loggined Success!",
      };
    } catch (error) {
      throw error;
    }
  }
}
