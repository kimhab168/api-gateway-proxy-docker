import config from "@/config";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: config.CLIENT_ID,
});

export const checkVerifyToken = async (token: string) => {
  try {
    const payload = await verifier.verify(token);
    return payload;
  } catch (error) {
    throw error;
  }
};
