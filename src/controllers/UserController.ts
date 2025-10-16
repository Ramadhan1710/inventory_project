import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
  private static userRepository = new UserRepository();

  static async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "username and password required" });
      }

      const user = await UserController.userRepository.register(username, password);
      return res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      if (error.message === "Username already exists") {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "username and password required" });
      }

      const token = await UserController.userRepository.login(username, password);
      return res.json({ token });
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const users = await UserController.userRepository.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const user = await UserController.userRepository.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await UserController.userRepository.update(
        req.params.id,
        username,
        password
      );
      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      await UserController.userRepository.delete(req.params.id);
      res.json({ message: "deleted" });
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
