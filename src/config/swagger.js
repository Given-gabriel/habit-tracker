// swagger.js
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "Habit Tracker API",
      version: "1.0.0",
      description: "API documentation for Habit Tracker project",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }], //apply globally for all routes
    servers: [
      {
        url: "http://localhost:4000/api", // base URL for your API
      },
    ],
  },
  apis: ["./src/routes/*.routes.js"], // path to files with Swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
