// Load environment variables first
import { config } from "dotenv";
config();

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { AIService } from "../../services/aiService";
import { MedicineService } from "../../services/medicinesService";
import { authenticateToken } from "../../middleware/auth";
import { insertMedicineSchema, updateMedicineSchema } from "../../db/schema";
import {
  testMedicineRouteSchema,
  getMedicinesSchema,
  getMedicineByIdSchema,
  createMedicineSchema,
  updateMedicineSchema as updateMedicineRouteSchema,
  deleteMedicineSchema,
  getMedicineStatsSchema,
  searchMedicinesSchema,
  validateMedicineSchema,
} from "./schema";

export async function medicineRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>();
  const aiService = new AIService();
  const medicineService = new MedicineService();

  // Simple test route without auth
  server.get(
    "/medicines/test",
    { schema: testMedicineRouteSchema },
    async (request, reply) => {
      return reply.send({
        success: true,
        message: "Medicine routes working!",
        timestamp: new Date().toISOString(),
      });
    }
  );

  // Get all medicines for authenticated user
  server.get(
    "/medicines",
    {
      schema: getMedicinesSchema,
      preHandler: [authenticateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const query = request.query;

        const medicines = await medicineService.getUserMedicines(userId, query);

        return reply.send({
          success: true,
          data: medicines,
        });
      } catch (error) {
        console.error("Get medicines error:", error);
        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );

  // Get specific medicine by ID
  server.get(
    "/medicines/:id",
    {
      schema: getMedicineByIdSchema,
      preHandler: [authenticateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const { id } = request.params;

        const medicine = await medicineService.getMedicineById(id, userId);

        if (!medicine) {
          return reply.status(404).send({
            success: false,
            error: "Medicine not found",
          });
        }

        return reply.send({
          success: true,
          data: medicine,
        });
      } catch (error) {
        console.error("Get medicine error:", error);
        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );

  // Create new medicine with AI validation
  server.post(
    "/medicines",
    {
      schema: createMedicineSchema,
      preHandler: [authenticateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const body = request.body;

        // Validate input with Drizzle schema as well
        const validatedData = insertMedicineSchema.parse(body);

        // Check for similar medicines using traditional search
        const similarMedicines = await medicineService.findSimilarMedicines(
          userId,
          validatedData.name,
          validatedData.location
        );

        // Get AI validation and insights
        console.log(`🤖 Validating medicine: "${validatedData.name}"`);
        const aiValidation = await aiService.validateMedicine(
          validatedData.name,
          validatedData.description || undefined
        );

        // Get AI-powered location suggestions
        const allUserMedicines = await medicineService.getUserMedicines(userId);
        const existingLocations = [
          ...new Set(allUserMedicines.map((m) => m.location)),
        ];
        const locationSuggestions = await aiService.suggestMedicineLocation(
          validatedData.name,
          existingLocations
        );

        // If similar medicines found, return a warning but don't block creation
        if (similarMedicines.length > 0) {
          console.log(
            `⚠️ Found ${similarMedicines.length} similar medicine(s)`
          );
        }

        // Apply AI category suggestion if none provided
        const finalData = {
          ...validatedData,
          category: validatedData.category || aiValidation.category || null,
        };

        // Create the medicine with AI-enhanced data
        const medicine = await medicineService.createMedicine(
          userId,
          finalData
        );

        return reply.status(201).send({
          success: true,
          data: medicine,
          message: "Medicine added successfully",
          aiInsights: {
            validation: aiValidation,
            similarMedicines: similarMedicines.map((m) => ({
              id: m.id,
              name: m.name,
              location: m.location,
              category: m.category,
            })),
            locationSuggestions,
            categoryApplied: finalData.category !== validatedData.category,
          },
        });
      } catch (error: any) {
        console.error("Create medicine error:", error);

        if (error.name === "ZodError") {
          return reply.status(400).send({
            success: false,
            error: "Invalid input data",
            details: error.errors,
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );

  // Update medicine (PUT)
  server.put(
    "/medicines/:id",
    {
      schema: updateMedicineRouteSchema,
      preHandler: [authenticateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const { id } = request.params;
        const body = request.body;

        // Validate with Drizzle schema as well
        const validatedData = updateMedicineSchema.parse(body);

        // Prepare update data with proper null handling
        const updateData: any = {};
        if (validatedData.name !== undefined)
          updateData.name = validatedData.name;
        if (validatedData.location !== undefined)
          updateData.location = validatedData.location;
        if (validatedData.description !== undefined)
          updateData.description = validatedData.description;
        if (validatedData.category !== undefined)
          updateData.category = validatedData.category;
        if (validatedData.quantity !== undefined)
          updateData.quantity = validatedData.quantity;
        if (validatedData.expiryDate !== undefined)
          updateData.expiryDate = validatedData.expiryDate;
        if (validatedData.notes !== undefined)
          updateData.notes = validatedData.notes;
        if (validatedData.imageUrl !== undefined)
          updateData.imageUrl = validatedData.imageUrl;

        const medicine = await medicineService.updateMedicine(
          id,
          userId,
          updateData
        );

        if (!medicine) {
          return reply.status(404).send({
            success: false,
            error: "Medicine not found",
          });
        }

        return reply.send({
          success: true,
          data: medicine,
          message: "Medicine updated successfully",
        });
      } catch (error: any) {
        console.error("Update medicine error:", error);

        if (error.name === "ZodError") {
          return reply.status(400).send({
            success: false,
            error: "Invalid input data",
            details: error.errors,
          });
        }

        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );

  // Delete medicine
  server.delete(
    "/medicines/:id",
    {
      schema: deleteMedicineSchema,
      preHandler: [authenticateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const { id } = request.params;

        const success = await medicineService.deleteMedicine(id, userId);

        if (!success) {
          return reply.status(404).send({
            success: false,
            error: "Medicine not found",
          });
        }

        return reply.send({
          success: true,
          message: "Medicine deleted successfully",
        });
      } catch (error) {
        console.error("Delete medicine error:", error);
        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );

  // Get user medicine statistics
  server.get(
    "/medicines/stats",
    {
      schema: getMedicineStatsSchema,
      preHandler: [authenticateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const stats = await medicineService.getMedicineStats(userId);

        return reply.send({
          success: true,
          data: stats,
        });
      } catch (error) {
        console.error("Get medicine stats error:", error);
        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );

  // AI-powered medicine search endpoint
  server.post(
    "/medicines/search",
    {
      schema: searchMedicinesSchema,
      preHandler: [authenticateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const { query } = request.body;

        console.log(`🔍 AI Search request: "${query.trim()}"`);

        // Get all user medicines first
        const allMedicines = await medicineService.getUserMedicines(userId);

        if (allMedicines.length === 0) {
          return reply.send({
            success: true,
            data: [],
            message: "No medicines found in your collection",
            searchQuery: query.trim(),
            totalMedicines: 0,
            resultsFound: 0,
          });
        }

        // Use AI to search semantically
        const results = await aiService.searchMedicines(
          allMedicines,
          query.trim()
        );

        return reply.send({
          success: true,
          data: results,
          searchQuery: query.trim(),
          totalMedicines: allMedicines.length,
          resultsFound: results.length,
          message: `Found ${results.length} medicine(s) matching your search`,
        });
      } catch (error) {
        console.error("AI search error:", error);
        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );

  // Medicine validation endpoint (for pre-validation before creation)
  server.post(
    "/medicines/validate",
    {
      schema: validateMedicineSchema,
      preHandler: [authenticateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.user!.userId;
        const { name, description, location } = request.body;

        console.log(`🔍 Validating medicine: "${name.trim()}"`);

        // Find similar medicines
        const similarMedicines = await medicineService.findSimilarMedicines(
          userId,
          name.trim(),
          location
        );

        // Get AI validation
        const aiValidation = await aiService.validateMedicine(
          name.trim(),
          description
        );

        // Get location suggestions
        const allMedicines = await medicineService.getUserMedicines(userId);
        const existingLocations = [
          ...new Set(allMedicines.map((m) => m.location)),
        ];
        const locationSuggestions = await aiService.suggestMedicineLocation(
          name.trim(),
          existingLocations
        );

        return reply.send({
          success: true,
          data: {
            similarMedicines: similarMedicines.map((m) => ({
              id: m.id,
              name: m.name,
              location: m.location,
              category: m.category,
            })),
            aiValidation,
            locationSuggestions,
            hasDuplicates: similarMedicines.length > 0,
            recommendations: {
              shouldProceed: aiValidation.isValid,
              suggestedCategory: aiValidation.category || null,
              duplicateWarning:
                similarMedicines.length > 0
                  ? `Found ${similarMedicines.length} similar medicine(s) in your collection`
                  : null,
            },
          },
        });
      } catch (error) {
        console.error("Validate medicine error:", error);
        return reply.status(500).send({
          success: false,
          error: "Internal server error",
        });
      }
    }
  );
}
