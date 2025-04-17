const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PubliShare API",
      version: "1.0.0",
      description:
        "תיעוד מלא ל־API של רשת חברתית מבית KobMiz. כולל ניהול משתמשים, פוסטים, תגובות, חיפוש ועוד.",
      contact: {
        name: "Kobi Mizrachi",
        email: "kobimizrachi@icloud.com",
      },
      termsOfService: "https://github.com/KobMiz/PubliShare",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
      {
        url: "https://your-production-server.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
