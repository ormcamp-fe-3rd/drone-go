const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: 'Drone Telemetry API',
      version: '1.0.0',
      description: 'API Documentation for Drone Telemetry Visualization',
    },
    externalDocs: {
      description: 'API JSON',
      url: "http://localhost:3000/swagger.json",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Main API server",
      },
    ],
    paths: {
      "/robots": {
        get: {
          summary: "Fetch available robots",
          description: "Fetch a list of all available robots",
          responses: {
            '200': {
              description: 'List of robots',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: "#/components/schemas/Robot"  } },
                },
              },
            },
            '400': { description: 'Invalid input' },
          },
        },
      },
      "/operations": {
        get: {
          summary: "Fetch available operations for a robot",
          description: "Fetch a list of all operations for a specific robot",
          parameters: [
            {
              name: "robot",
              in: "query",
              description: "The robot ID",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            '200': {
              description: 'List of operations for the robot',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { "$ref": "#/components/schemas/Operation" } },
                },
              },
            },
            '400': { description: 'Invalid input' },
          },
        },
      },
      "/telemetries": {
        get: {
          summary: "Fetch telemetry data for a robot and operation",
          description: "Fetch telemetry data based on robot and operation, and allow filtering by telemetry fields",
          parameters: [
            {
              name: "robot",
              in: "query",
              description: "The robot ID",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "operation",
              in: "query",
              description: "The operation ID",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "msgId",
              in: "query",
              description: "Filter telemetry by message ID (optional)",
              required: false,
              schema: { type: "integer" },
            },
            {
              name: "timestamp",
              in: "query",
              description: "Filter telemetry by timestamp (optional)",
              required: false,
              schema: { type: "string", format: "date-time" },
            },
            {
              name: "fields",
              in: "query",
              description: "Comma-separated list of fields to filter (e.g., lat, lon, alt)",
              required: false,
              schema: { type: "string" },
            },
          ],
          responses: {
            '200': {
              description: 'Filtered telemetry data',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { "$ref": "#/components/schemas/Telemetry" } },
                },
              },
            },
            '400': { description: 'Invalid input' },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, './models/*.js'),
    path.join(__dirname, './routes/*.js'),
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};