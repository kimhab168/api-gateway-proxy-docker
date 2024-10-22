import UserModel, { userType } from "../model/user.model";
import { PaginationType } from "./types/user.type";

interface newQueryType {
  sort: {} | { [key: string]: 1 | -1 };
  filter:
    | {}
    | { [key: string]: string | number | { [key: string]: string | number } };
  limit: number;
  skip: number;
  page: number;
}

export class UserRepository {
  async getAllUser(query: newQueryType): Promise<PaginationType> {
    try {
      const { filter, limit, page, sort, skip } = query;
      const data = await UserModel.find(filter)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .exec();
      const totalItems = await UserModel.countDocuments(filter);
      const totalPage = Math.ceil(totalItems / limit);
      return {
        data: data,
        total: totalItems,
        currentPage: page,
        totalPage: totalPage,
        limit: limit,
        skip: skip,
      };
    } catch (error) {
      throw new Error("Failed to fetch getAllUser() in repo");
    }
  }
  async getUserById(id: string): Promise<userType> {
    try {
      const data = await UserModel.findById(id);
      if (!data) {
        throw new Error("the User not found!");
      }
      return data;
    } catch (error) {
      throw error;
      // throw new Error("Failed to fetch getUserById() in repo");
    }
  }
  async updateUserById(id: string, newUser: userType): Promise<userType> {
    try {
      const update = await UserModel.findByIdAndUpdate(id, newUser, {
        new: true,
      });
      if (!update) {
        throw new Error("the product not found!");
      }
      return update;
    } catch (error) {
      throw error;
    }
  }
  async deleteUserById(id: string): Promise<userType> {
    try {
      const data = await UserModel.findByIdAndDelete(id);
      if (!data) {
        throw new Error("the User not found!");
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async newUser(userRequest: userType): Promise<userType> {
    try {
      const newUser = await UserModel.create(userRequest);

      return newUser;
    } catch (error) {
      throw new Error("Failed to create newUser() in repo");
    }
  }
}
export default new UserRepository();
