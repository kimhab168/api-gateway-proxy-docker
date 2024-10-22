import mongoose, { Schema } from "mongoose";

export interface userType {
  sub: string;
  email: string;
}

const UserSchema = new Schema<userType>(
  {
    sub: { type: String, required: true, unique: true },
    email: { type: String, required: true },
  },
  { versionKey: false }
);

export const UserModel = mongoose.model<userType>("Users", UserSchema);

export default UserModel;
