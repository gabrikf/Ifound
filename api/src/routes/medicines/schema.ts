import { z } from "zod";

// Base medicine schemas
export const medicineIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid medicine ID format").transform(Number),
});

export const medicineSearchQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  sortBy: z.enum(["name", "location", "createdAt", "expiryDate"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
});

// Request body schemas
export const createMedicineBodySchema = z.object({
  name: z.string().min(1, "Medicine name is required").max(255),
  location: z.string().min(1, "Location is required").max(255),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  quantity: z.number().int().min(0).optional(),
  expiryDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional(),
});

export const updateMedicineBodySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  location: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  quantity: z.number().int().min(0).optional(),
  expiryDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional(),
});

export const searchMedicinesBodySchema = z.object({
  query: z.string().min(1, "Search query is required").max(500),
});

export const validateMedicineBodySchema = z.object({
  name: z.string().min(1, "Medicine name is required").max(255),
  description: z.string().max(1000).optional(),
  location: z.string().max(255).optional(),
});

// Response schemas
export const medicineSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  quantity: z.number().nullable(),
  expiryDate: z.date().nullable(),
  notes: z.string().nullable(),
  imageUrl: z.string().nullable(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const similarMedicineSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  category: z.string().nullable(),
});

export const aiValidationSchema = z.object({
  isValid: z.boolean(),
  category: z.string().optional(),
  suggestions: z.array(z.string()).optional(),
});

export const medicineStatsSchema = z.object({
  total: z.number(),
  expiringSoon: z.number(),
  categories: z.record(z.string(), z.number()),
  locations: z.record(z.string(), z.number()),
});

// Success response schemas
export const successResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.any().optional(),
});

export const testResponseSchema = successResponseSchema.extend({
  timestamp: z.string(),
});

export const getMedicinesResponseSchema = successResponseSchema.extend({
  data: z.array(medicineSchema),
});

export const getMedicineResponseSchema = successResponseSchema.extend({
  data: medicineSchema,
});

export const createMedicineResponseSchema = successResponseSchema.extend({
  data: medicineSchema,
  aiInsights: z.object({
    validation: aiValidationSchema,
    similarMedicines: z.array(similarMedicineSchema),
    locationSuggestions: z.array(z.string()),
    categoryApplied: z.boolean(),
  }),
});

export const updateMedicineResponseSchema = successResponseSchema.extend({
  data: medicineSchema,
});

export const deleteMedicineResponseSchema = successResponseSchema;

export const medicineStatsResponseSchema = successResponseSchema.extend({
  data: medicineStatsSchema,
});

export const searchMedicinesResponseSchema = successResponseSchema.extend({
  data: z.array(medicineSchema),
  searchQuery: z.string(),
  totalMedicines: z.number(),
  resultsFound: z.number(),
});

export const validateMedicineResponseSchema = successResponseSchema.extend({
  data: z.object({
    similarMedicines: z.array(similarMedicineSchema),
    aiValidation: aiValidationSchema,
    locationSuggestions: z.array(z.string()),
    hasDuplicates: z.boolean(),
    recommendations: z.object({
      shouldProceed: z.boolean(),
      suggestedCategory: z.string().nullable(),
      duplicateWarning: z.string().nullable(),
    }),
  }),
});

// Route schemas for Fastify with ZodTypeProvider
export const getMedicinesSchema = {
  querystring: medicineSearchQuerySchema,
  response: {
    200: getMedicinesResponseSchema,
    500: errorResponseSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Medicines"],
  description: "Get all medicines for authenticated user",
} as const;

export const getMedicineByIdSchema = {
  params: medicineIdParamSchema,
  response: {
    200: getMedicineResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Medicines"],
  description: "Get a specific medicine by ID",
} as const;

export const createMedicineSchema = {
  body: createMedicineBodySchema,
  response: {
    201: createMedicineResponseSchema,
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Medicines"],
  description: "Create a new medicine with AI validation",
} as const;

export const updateMedicineSchema = {
  params: medicineIdParamSchema,
  body: updateMedicineBodySchema,
  response: {
    200: updateMedicineResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Medicines"],
  description: "Update a medicine completely",
} as const;

export const deleteMedicineSchema = {
  params: medicineIdParamSchema,
  response: {
    200: deleteMedicineResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    500: errorResponseSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Medicines"],
  description: "Delete a medicine",
} as const;

export const getMedicineStatsSchema = {
  response: {
    200: medicineStatsResponseSchema,
    500: errorResponseSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Medicines"],
  description: "Get medicine statistics for authenticated user",
} as const;

export const searchMedicinesSchema = {
  body: searchMedicinesBodySchema,
  response: {
    200: searchMedicinesResponseSchema,
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Medicines"],
  description: "AI-powered semantic search through user's medicines",
} as const;

export const validateMedicineSchema = {
  body: validateMedicineBodySchema,
  response: {
    200: validateMedicineResponseSchema,
    400: errorResponseSchema,
    500: errorResponseSchema,
  },
  security: [{ bearerAuth: [] }],
  tags: ["Medicines"],
  description: "Validate medicine details before creation",
} as const;

export const testMedicineRouteSchema = {
  response: {
    200: testResponseSchema,
  },
  tags: ["Medicines"],
  description: "Test endpoint for medicine routes",
} as const;
