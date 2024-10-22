import { userType } from "@/database/model/user.model";
import UserRepository from "@/database/repositories/user.repo";
import {
  PaginationType,
  QueriesType,
} from "@/database/repositories/types/user.type";

class UserService {
  async getAllUsers(query: QueriesType | undefined): Promise<PaginationType> {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 5;
      const skip = (page - 1) * limit;

      const sort = query?.sort ? JSON.parse(query?.sort as string) : {};
      const filter = query?.filter ? JSON.parse(query?.filter as string) : {};
      const newFilter: {
        [key: string]: string | number | { [key: string]: string | number };
      } = {};

      for (let i in filter) {
        if (typeof filter[i] === "object") {
          newFilter[i] = {};
          for (let j in filter[i]) {
            if (j === "min") {
              newFilter[i]["$gte"] = filter[i][j];
            } else if (j === "max") {
              newFilter[i]["$lte"] = filter[i][j];
            }
          }
        } else {
          newFilter[i] = filter[i];
        }
      }

      const newSort: { [key: string]: 1 | -1 } = {};
      for (let i in sort) {
        newSort[i] = sort[i] === "asc" ? 1 : -1;
      }

      const newQuery = {
        sort: newSort,
        filter: newFilter,
        limit: limit,
        skip: skip,
        page: page,
      };
      // console.log(newQuery);

      const res = await UserRepository.getAllUser(newQuery);
      return res;
    } catch (error) {
      console.error("getAllUser() Service error", error);
      throw new Error("Failed to fetch getAllUser() Service");
    }
  }
  async getUserById(id: string): Promise<userType> {
    try {
      const data = await UserRepository.getUserById(id);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateUserById(id: string, update: userType): Promise<userType> {
    try {
      const data = await UserRepository.updateUserById(id, update);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteUserById(id: string): Promise<userType> {
    try {
      const data = await UserRepository.deleteUserById(id);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async createUser(newUser: userType): Promise<userType> {
    try {
      const data = await UserRepository.newUser(newUser);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
export default new UserService();
