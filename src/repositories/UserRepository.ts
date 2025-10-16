import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  /**
   * Register user baru
   */
  async register(username: string, password: string): Promise<User> {
    // Check if username already exists
    const exists = await this.repository.findOne({ where: { username } });
    if (exists) {
      throw new Error("Username already exists");
    }

    // Create new user (password will be hashed by @BeforeInsert)
    const user = this.repository.create({ username, password });
    await this.repository.save(user);
    
    return user;
  }

  /**
   * Login user dan generate JWT token
   */
  async login(username: string, password: string): Promise<string> {
    // Find user by username
    const user = await this.repository.findOne({ where: { username } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "change_this_secret";
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "7d" });
    
    return token;
  }

  /**
   * Get all users (tanpa password)
   */
  async findAll(): Promise<User[]> {
    return await this.repository.find({ select: ["id", "username"] });
  }

  /**
   * Get user by ID (tanpa password)
   */
  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * Update user
   */
  async update(id: string, username?: string, password?: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    // Update fields
    if (username) user.username = username;
    if (password) {
      // Hash password manually for update (BeforeInsert tidak trigger pada update)
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await this.repository.save(user);
    return user;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    await this.repository.remove(user);
  }
}
