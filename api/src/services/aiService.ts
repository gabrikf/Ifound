import type { AISearchRequest } from "../types/index.js";
import type { Medicine } from "../db/schema.js";

export class AIService {
  private openai: any = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    // In test environment, don't initialize OpenAI if key is clearly a test key
  }

  async validateMedicine(
    name: string,
    description?: string
  ): Promise<{
    isValid: boolean;
    suggestions?: string[];
    category?: string;
  }> {
    if (!this.openai) {
      return { isValid: true }; // Fallback if no AI configured
    }

    try {
      const prompt = `
        Analyze this medicine information:
        Name: ${name}
        Description: ${description || "Not provided"}
        
        Please provide:
        1. Is this a valid medicine name? (true/false)
        2. Suggest any corrections if the name seems misspelled
        3. What category would this medicine belong to? (e.g., "Pain Relief", "Antibiotics", "Heart Medication", etc.)
        
        Respond in JSON format:
        {
          "isValid": boolean,
          "suggestions": ["corrected name if needed"],
          "category": "category name"
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that validates medicine names and provides categorization. Always respond with valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } catch (error) {
      // In test environment, don't log AI errors to reduce noise
      if (process.env.NODE_ENV !== "test") {
        console.error("AI validation error:", error);
      }
    }

    return { isValid: true }; // Fallback
  }

  async searchMedicines(
    medicines: Medicine[],
    query: string
  ): Promise<Medicine[]> {
    if (!this.openai || medicines.length === 0) {
      console.log("AIService: Fallback to simple search");
      // Fallback: simple text search
      const lowerQuery = query.toLowerCase();
      return medicines.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(lowerQuery) ||
          medicine.description?.toLowerCase().includes(lowerQuery) ||
          medicine.location.toLowerCase().includes(lowerQuery) ||
          medicine.notes?.toLowerCase().includes(lowerQuery)
      );
    }

    try {
      const medicineList = medicines.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description || "",
        location: m.location,
        category: m.category || "",
        notes: m.notes || "",
      }));

      const prompt = `
        Given this user query: "${query}"
        
        Find the most relevant medicines from this list:
        ${JSON.stringify(medicineList, null, 2)}
        
        Consider semantic meaning, not just exact matches. For example:
        - "headache medicine" should match medicines with "pain" or "analgesic"
        - "where did I put my blood pressure pills" should match heart/cardiovascular medicines
        - Location-based queries should prioritize location matches
        
        Return the IDs of relevant medicines in order of relevance as a JSON array:
        In pt-BR
        [1, 5, 3]
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that performs semantic search on medicine data. Always respond with a JSON array of medicine IDs.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 100,
      });
      console.log(response);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const relevantIds: number[] = JSON.parse(content);
        return medicines.filter((m) => relevantIds.includes(m.id));
      }
    } catch (error) {
      // In test environment, don't log AI errors to reduce noise
      if (process.env.NODE_ENV !== "test") {
        console.error("AI search error:", error);
      }
    }

    // Fallback to simple search
    const lowerQuery = query.toLowerCase();
    return medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(lowerQuery) ||
        medicine.description?.toLowerCase().includes(lowerQuery) ||
        medicine.location.toLowerCase().includes(lowerQuery) ||
        medicine.notes?.toLowerCase().includes(lowerQuery)
    );
  }

  async suggestMedicineLocation(
    medicineName: string,
    existingLocations: string[]
  ): Promise<string[]> {
    if (!this.openai) {
      return existingLocations.slice(0, 3); // Return first 3 existing locations as suggestions
    }

    try {
      const prompt = `
        For a medicine named "${medicineName}", suggest the best storage locations.
        
        Consider:
        - Medicine type and storage requirements
        - Common household storage areas
        - Safety considerations
        
        Existing locations used by this user: ${existingLocations.join(", ")}
        
        Provide 3-5 location suggestions as a JSON array:
        ["Kitchen cabinet", "Bathroom medicine cabinet", "Bedroom nightstand"]
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that suggests appropriate medicine storage locations. Always respond with a JSON array.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } catch (error) {
      // In test environment, don't log AI errors to reduce noise
      if (process.env.NODE_ENV !== "test") {
        console.error("AI location suggestion error:", error);
      }
    }

    return ["Medicine Cabinet", "Kitchen Cabinet", "Bedroom Drawer"];
  }
}
