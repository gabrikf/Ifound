import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { authRoutes } from "./routes/auth/index";
import "dotenv/config";
import { medicineRoutes } from "./routes/medicines";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API de Ifound",
      description: "Documentação da API de Ifound",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from /auth/login endpoint",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

// Declare a route
app.register(authRoutes);
app.register(medicineRoutes);

// Run the server!
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server listening on http://localhost:3000");
    console.log("docs on http://localhost:3000/docs");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
