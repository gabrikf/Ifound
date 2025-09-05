import { eq, and, desc, asc, or, like } from "drizzle-orm";
import { db } from "../db/index.js";
import { medicines, users } from "../db/schema.js";
import type { Medicine, NewMedicine } from "../db/schema.js";
import type { MedicineSearchQuery } from "../types/index.js";

export class MedicineService {
  async createMedicine(
    userId: number,
    medicineData: Omit<NewMedicine, "userId">
  ): Promise<Medicine> {
    const insertData = {
      ...medicineData,
      userId,
      updatedAt: new Date(),
    };

    try {
      const newMedicine = await db
        .insert(medicines)
        .values(insertData)
        .returning();

      return newMedicine[0]!;
    } catch (error) {
      console.error("Create medicine error:", error);
      throw error;
    }
  }

  async getMedicineById(id: number, userId: number): Promise<Medicine | null> {
    const medicine = await db
      .select()
      .from(medicines)
      .where(and(eq(medicines.id, id), eq(medicines.userId, userId)))
      .limit(1);

    return medicine[0] || null;
  }

  async getUserMedicines(
    userId: number,
    query: MedicineSearchQuery = {}
  ): Promise<Medicine[]> {
    const {
      search,
      category,
      location,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = 50,
      offset = 0,
    } = query;

    // Build where conditions
    const conditions = [eq(medicines.userId, userId)];

    if (search) {
      conditions.push(
        or(
          like(medicines.name, `%${search}%`),
          like(medicines.description, `%${search}%`),
          like(medicines.location, `%${search}%`),
          like(medicines.notes, `%${search}%`)
        )!
      );
    }

    if (category) {
      conditions.push(eq(medicines.category, category));
    }

    if (location) {
      conditions.push(like(medicines.location, `%${location}%`));
    }

    // Build sorting
    const sortColumns = {
      name: medicines.name,
      location: medicines.location,
      createdAt: medicines.createdAt,
      expiryDate: medicines.expiryDate,
    };

    const sortColumn =
      sortColumns[sortBy as keyof typeof sortColumns] || medicines.createdAt;
    const orderFn = sortOrder === "asc" ? asc : desc;

    // Execute the query
    return db
      .select()
      .from(medicines)
      .where(and(...conditions))
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);
  }

  async updateMedicine(
    id: number,
    userId: number,
    updates: Partial<Omit<Medicine, "id" | "userId" | "createdAt">>
  ): Promise<Medicine | null> {
    const updatedMedicine = await db
      .update(medicines)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(medicines.id, id), eq(medicines.userId, userId)))
      .returning();

    return updatedMedicine[0] || null;
  }

  async deleteMedicine(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(medicines)
      .where(and(eq(medicines.id, id), eq(medicines.userId, userId)))
      .returning({ deletedId: medicines.id });

    return result.length > 0;
  }

  async findSimilarMedicines(
    userId: number,
    name: string,
    location?: string
  ): Promise<Medicine[]> {
    let searchConditions = [
      eq(medicines.userId, userId),
      like(medicines.name, `%${name}%`),
    ];

    if (location) {
      searchConditions.push(like(medicines.location, `%${location}%`));
    }

    return db
      .select()
      .from(medicines)
      .where(and(...searchConditions))
      .limit(5);
  }

  async getMedicineStats(userId: number): Promise<{
    total: number;
    expiringSoon: number;
    categories: Record<string, number>;
    locations: Record<string, number>;
  }> {
    const allMedicines = await db
      .select()
      .from(medicines)
      .where(eq(medicines.userId, userId));

    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const expiringSoon = allMedicines.filter(
      (m) => m.expiryDate && new Date(m.expiryDate) <= thirtyDaysFromNow
    ).length;

    const categories: Record<string, number> = {};
    const locations: Record<string, number> = {};

    allMedicines.forEach((medicine) => {
      if (medicine.category) {
        categories[medicine.category] =
          (categories[medicine.category] || 0) + 1;
      }
      if (medicine.location) {
        locations[medicine.location] = (locations[medicine.location] || 0) + 1;
      }
    });

    return {
      total: allMedicines.length,
      expiringSoon,
      categories,
      locations,
    };
  }
}
