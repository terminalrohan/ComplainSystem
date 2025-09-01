import { complaints, admins, type Complaint, type InsertComplaint, type Admin, type InsertAdmin } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Complaint operations
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getAllComplaints(): Promise<Complaint[]>;
  deleteComplaint(id: number): Promise<void>;
  
  // Admin operations
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class DatabaseStorage implements IStorage {
  async createComplaint(complaintData: InsertComplaint): Promise<Complaint> {
    const [complaint] = await db
      .insert(complaints)
      .values(complaintData)
      .returning();
    return complaint;
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return await db.select().from(complaints).orderBy(complaints.createdAt);
  }

  async deleteComplaint(id: number): Promise<void> {
    await db.delete(complaints).where(eq(complaints.id, id));
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin || undefined;
  }

  async createAdmin(adminData: InsertAdmin): Promise<Admin> {
    const [admin] = await db
      .insert(admins)
      .values(adminData)
      .returning();
    return admin;
  }
}

export const storage = new DatabaseStorage();
