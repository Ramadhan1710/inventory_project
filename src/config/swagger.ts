import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Management API",
      version: "1.0.0",
      description: "REST API untuk manajemen inventory dengan Node.js, TypeScript, Express, dan PostgreSQL",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Masukkan JWT token yang didapat dari endpoint /api/users/login",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User ID",
            },
            username: {
              type: "string",
              description: "Username",
            },
          },
        },
        Barang: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Barang ID",
            },
            nama: {
              type: "string",
              description: "Nama barang",
            },
            kode: {
              type: "string",
              description: "Kode barang (BRG/YY/MM/00001)",
              example: "BRG/25/10/00001",
            },
            stok: {
              type: "integer",
              description: "Jumlah stok",
            },
            hargaText: {
              type: "string",
              description: "Harga barang (string)",
            },
            fotoPath: {
              type: "string",
              description: "Path file foto",
            },
          },
        },
        Price: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Price ID",
            },
            harga: {
              type: "string",
              description: "Harga",
            },
            tanggalBerlaku: {
              type: "string",
              format: "date",
              description: "Tanggal berlaku harga",
              example: "2025-10-16",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    security: [],
  },
  apis: ["./src/routes/*.ts"], // Path ke file routes untuk dokumentasi
};

export const swaggerSpec = swaggerJsdoc(options);
