const { generateApi } = require("swagger-typescript-api");
const path = require("path");
const fs = require("fs-extra");

async function generateTypes() {
  try {
    const OUTPUT_DIR = path.resolve(__dirname, "../src/generated");

    // Clean output directory
    await fs.emptyDir(OUTPUT_DIR);

    console.log("📡 Generating types from Swagger...");
    console.log("📋 Fetching from: http://localhost:3001/api");

    // Generate types from running NestJS Swagger
    await generateApi({
      name: "api.ts",
      output: OUTPUT_DIR,
      url: "http://localhost:3001/api-json",
      generateClient: false, // Set to true if you want API client too
      generateResponses: true,
      generateRouteTypes: false,
      generateUnionEnums: true,
      httpClientType: "fetch",
      modular: false,
      cleanOutput: true,
      enumNamesAsValues: true,
      prettier: {
        printWidth: 100,
        tabWidth: 2,
        trailingComma: "es5",
        parser: "typescript",
      },
    });

    console.log("✅ Types generated successfully!");
    console.log("📁 Output: packages/types/src/generated/Api.ts");
  } catch (error) {
    console.error("❌ Error generating types:", error.message);
    console.log(
      "💡 Make sure your NestJS server is running on http://localhost:3001/api-json",
    );
    process.exit(1);
  }
}

generateTypes();
