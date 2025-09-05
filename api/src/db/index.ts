import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { mkdirSync, existsSync } from "fs";
import path from "path";
// Uncomment if you want to use migrations
// import { migrate } from "drizzle-orm/better-sqlite3/migrator";

// Global database instance for tests to share
declare global {
  // eslint-disable-next-line no-var
  var __testDb: ReturnType<typeof drizzle> | undefined;
  // eslint-disable-next-line no-var
  var __testDbPath: string | undefined;
}

// Determine database path based on environment
const getDatabasePath = () => {
  if (process.env.NODE_ENV === "test") {
    // In test mode, use the shared test database path if available
    return (
      globalThis.__testDbPath ||
      process.env.DATABASE_URL ||
      "./data/test.sqlite"
    );
  }
  return process.env.DATABASE_URL || "./data/database.sqlite";
};

// Function to create a database connection
const createDatabase = (dbPath: string) => {
  const sqlite = new Database(dbPath);
  return drizzle(sqlite, { schema });
};

// Get or create the database instance
const getDatabaseInstance = () => {
  if (process.env.NODE_ENV === "test" && globalThis.__testDb) {
    return globalThis.__testDb;
  }

  const databasePath = getDatabasePath();
  return createDatabase(databasePath);
};

// Ensure directory exists synchronously to avoid async issues
function ensureDirectoryExistenceSync() {
  try {
    const databasePath = getDatabasePath();
    const dataDir = path.dirname(databasePath);
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
  } catch (error) {
    console.error("Failed to create data directory:", error);
    throw error;
  }
}

// Lazy database initialization to avoid freezing
let _db: ReturnType<typeof drizzle> | null = null;

const getDatabase = () => {
  if (_db) {
    return _db;
  }

  // Only initialize when first accessed
  ensureDirectoryExistenceSync();
  _db = getDatabaseInstance();

  // Auto-migrate on startup for development (only once)
  if (process.env.NODE_ENV === "development") {
    try {
      // migrate(_db, { migrationsFolder: './drizzle' });
      console.log("✅ Database connected");
    } catch (error) {
      console.log("Database migration skipped - no migrations found");
    }
  }

  return _db;
};

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const database = getDatabase();
    return database[prop as keyof typeof database];
  },
});

// Function for tests to set the database instance
export function setTestDatabase(
  testDb: ReturnType<typeof drizzle>,
  testPath: string
) {
  globalThis.__testDb = testDb;
  globalThis.__testDbPath = testPath;
}

export { schema };
