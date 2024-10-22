import {
  AdminAddUserToGroupCommand,
  AdminAddUserToGroupCommandInput,
  AdminGetUserCommand,
  AdminGetUserCommandInput,
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
import {
  SignUpRequest,
  VerifyUserRequest,
} from "@/controllers/types/auth.types";
import axios from "axios";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

class AuthService {
  private createHmacSecret(username: string): string {
    return createHmac("sha256", config.CLIENT_SECRET)
      .update(username + config.CLIENT_ID)
      .digest("base64");
  }
  async signup(body: SignUpRequest) {
    try {
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
      console.log("auth service on client.send");

      const res = await client.send(command);
      return res;
    } catch (error) {
      throw error;
    }
  }
  async confirmSignup(req: VerifyUserRequest) {
    const input: ConfirmSignUpCommandInput = {
      // ConfirmSignUpRequest
      ClientId: config.CLIENT_ID, // required
      SecretHash: this.createHmacSecret(req.username),
      Username: req.username, // required
      ConfirmationCode: req.code, // required
    };
    try {
      const command = new ConfirmSignUpCommand(input);
      // console.log("auth service above client.send");

      const res = await client.send(command);
      // console.log("hi bro error");

      const userInfo = await this.getUserByUsername(req.username);

      // console.log("UserInfo", userInfo);
      //add user to group
      await this.addToGroup(req.username);
      //add to DB
      const email = userInfo.UserAttributes?.filter(
        (attr) => attr.Name === "email"
      )[0]?.Value;

      console.log(email);

      await axios.post("http://localhost:4003/v1/users", {
        sub: userInfo.Username,
        email: email,
      });
      // console.log("user added to DB");

      return res;
    } catch (error) {
      throw error;
    }
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
  async addToGroup(username: string, groupName: string = "user") {
    try {
      const params: AdminAddUserToGroupCommandInput = {
        GroupName: groupName,
        Username: username,
        UserPoolId: config.COGNITO_USER_POOL_ID,
      };
      const command = new AdminAddUserToGroupCommand(params);
      await client.send(command);
      console.log(
        `AuthService confirmSignup() method: User added to ${groupName}`
      );
    } catch (error) {
      throw error;
    }
  }
  async getUserByUsername(username: string) {
    const params: AdminGetUserCommandInput = {
      Username: username,
      UserPoolId: config.COGNITO_USER_POOL_ID,
    };
    try {
      const command = new AdminGetUserCommand(params);
      const userInfo = await client.send(command);
      return userInfo;
    } catch (error) {
      console.error("AuthService getUserByUsername() error", error);

      throw error;
    }
  }
}
export default new AuthService();
