import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./config/data-source";
import { router } from "./routes";
import { swaggerSpec } from "./config/swagger";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// static uploads
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(`/${uploadDir}`, express.static(path.join(__dirname, "..", uploadDir)));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Inventory API Documentation",
}));

app.use(router);

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server started on http://localhost:${port}`);
      console.log(`API Documentation: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Error during Data Source initialization", err);
  });
