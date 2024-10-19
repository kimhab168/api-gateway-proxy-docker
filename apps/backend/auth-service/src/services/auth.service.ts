import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import

import { createHmac } from "crypto";

import config from "@/config";
interface SignUpType {
  username?: string;
  email: string;
  password: string;
}
interface VerifySignup {
  username: string;
  code: string;
}

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

class AuthService {
  private createHmacSecret(username: string): string {
    return createHmac("sha256", config.CLIENT_SECRET)
      .update(username + config.CLIENT_ID)
      .digest("base64");
  }
  async signup(body: SignUpType) {
    const input: SignUpCommandInput = {
      // SignUpRequest
      ClientId: config.CLIENT_ID,
      SecretHash: this.createHmacSecret(body.username || body.email),
      Username: body.username || body.email,
      Password: body.password,
      UserAttributes: [
        {
          Name: "email",
          Value: body.email,
        },
      ],
    };

    const command = new SignUpCommand(input);
    const res = await client.send(command);
    return res;
  }
  async confirmSignup(req: VerifySignup) {
    const input: ConfirmSignUpCommandInput = {
      // ConfirmSignUpRequest
      ClientId: config.CLIENT_ID, // required
      SecretHash: this.createHmacSecret(req.username),
      Username: req.username, // required
      ConfirmationCode: req.code, // required
    };
    const command = new ConfirmSignUpCommand(input);
    const res = await client.send(command);
    return res;
  }
  async login(req: { username: string; password: string }) {
    const input: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH", // required
      AuthParameters: {
        USERNAME: req.username,
        PASSWORD: req.password,
        SECRET_HASH: this.createHmacSecret(req.username),
      },
      ClientId: config.CLIENT_ID,
    };
    const command = new InitiateAuthCommand(input);
    const res = await client.send(command);
    return res.AuthenticationResult;
  }
}
export default new AuthService();
