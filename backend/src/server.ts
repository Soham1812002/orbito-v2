import app from "./app.js";
import { ENV } from "./utils/env.util.js";
import { logger } from "./configs/logger.js";
import { testDatabaseConnection } from "./configs/database.js";
import { checkMigrations, runMigrations } from "./migrations/runner.js";
import { runSeeds } from "./migrations/seed.js";

const startServer = async () => {
  try {
    logger.info("Initializing Orbito Backend Service...");

    // 1. Verify Database Connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      logger.error("Could not connect to PostgreSQL database. Exiting...");
      process.exit(1);
    }

    // 2. Pre-flight Zero-Drift Migration Guard
    const { inSync, pending } = await checkMigrations();
    if (!inSync) {
      if (ENV.NODE_ENV === "development" || process.env.AUTO_MIGRATE === "true") {
        logger.warn(`Pending migrations detected in development: ${pending.join(", ")}. Auto-applying...`);
        await runMigrations();
        await runSeeds();
      } else {
        logger.error(`FATAL: Pending migrations detected in code: ${pending.join(", ")}`);
        logger.error("Startup halted by Zero-Drift Database Migration Guard. Run 'npm run migrate' before deploying.");
        process.exit(1);
      }
    } else {
      logger.info("Database migration pre-flight check passed: Zero drift detected.");
    }

    // 3. Start HTTP Listener
    const server = app.listen(ENV.PORT, () => {
      logger.info(`Orbito Backend API listening on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
      logger.info(`Health Check: http://localhost:${ENV.PORT}/v1/api/health`);
    });

    // 4. Graceful Shutdown Handlers
    const handleShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));
  } catch (error) {
    logger.error("Fatal error during server startup:", error);
    process.exit(1);
  }
};

startServer();
