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
        description: 'API json',
        url: "http://localhost:3000/swagger.json"
    },
    servers: [
        {
          url: "http://localhost:3000",  // 절대 URL을 여기에 설정
          description: "Main API server",
        },
      ],
    paths: {
      // 로봇 목록 요청 경로
      "/robots": {
        get: {
          summary: "Fetch available robots",
          description: "Fetch a list of all available robots",
          responses: {
            '200': {
              description: 'List of robots',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { type: 'string' },  // 로봇 ID가 string으로 전달된다고 가정
                  }
                }
              }
            },
            '400': { description: 'Invalid input' }
          }
        }
      },
      
      // 특정 로봇에 대한 오퍼레이션 목록 요청 경로
      "/operations": {
        get: {
          summary: "Fetch available operations for a robot",
          description: "Fetch a list of all operations for a specific robot",
          parameters: [
            {
              name: "robotId",
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
                  schema: {
                    type: 'array',
                    items: { type: 'string' }  // 오퍼레이션 ID가 string으로 전달된다고 가정
                  }
                }
              }
            },
            '400': { description: 'Invalid input' }
          }
        }
      },

      // 텔레메트리 데이터 요청 경로
      "/telemetries": {
        get: {
          summary: "Fetch telemetry data for a robot and operation",
          description: "Fetch telemetry data based on robotId and operationId, and allow filtering by telemetry fields",
          parameters: [
            {
              name: "robotId",
              in: "query",
              description: "The robot ID",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "operationId",
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
                  schema: {
                    type: 'array',
                    items: { type: 'object' }  // 텔레메트리 필드를 동적으로 받아올 예정
                  }
                }
              }
            },
            '400': { description: 'Invalid input' }
          }
        }
      }
    },
  },
  apis: [
    path.join(__dirname, './models/*.js'), // 모델 파일 경로
    path.join(__dirname, './routes/*.js'), // 라우트 파일 경로
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
  swaggerSpec
};