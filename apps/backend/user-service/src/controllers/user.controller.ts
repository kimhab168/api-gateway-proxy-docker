import { userType } from "@/database/model/user.model";
import { QueriesType } from "@/database/repositories/types/user.type";
import UserService from "@/services/user.service";
import {
  Controller,
  Route,
  Get,
  Tags,
  Path,
  Put,
  Body,
  Delete,
  Queries,
  Post,
} from "tsoa";

@Route("/v1/users")
export class UserController extends Controller {
  constructor() {
    super();
  }
  @Get("/")
  @Tags("Get All Users")
  public async getAllUsers(@Queries() query: QueriesType) {
    try {
      const res = await UserService.getAllUsers(query);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Get("{id}")
  @Tags("Get Product By ID")
  async getUserById(@Path() id: string) {
    try {
      const res = await UserService.getUserById(id);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Put("{id}")
  @Tags("Update User By ID")
  async updateUserById(@Path() id: string, @Body() reqBody: userType) {
    try {
      const res = await UserService.updateUserById(id, reqBody);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Delete("{id}")
  @Tags("Delete User By ID")
  async deleteUserById(@Path() id: string) {
    try {
      await UserService.deleteUserById(id);
      return this.setStatus(204);
    } catch (error) {
      throw error;
    }
  }
  @Post()
  @Tags("Create new User")
  async createProduct(@Body() reqBody: userType) {
    try {
      const res = await UserService.createUser(reqBody);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
