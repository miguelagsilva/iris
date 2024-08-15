import axios from "axios";
import { exec } from "child_process";
import { writeFileSync } from "fs";

async function main() {
  try {
    const response = await axios.get("http://localhost:3000/swagger/json");
    writeFileSync(
      "./openapi-spec.json",
      JSON.stringify(response.data, null, 2),
    );

    exec(
      "rm -f ./src/lib/Api.ts && pnpm dlx swagger-typescript-api -p ./openapi-spec.json -o ./src/lib --axios",
      (error, stdout) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`API client generated: ${stdout}`);
        process.exit(0);
      },
    );
  } catch (error) {
    console.error("Error fetching OpenAPI JSON:", error);
    process.exit(1);
  }
}

main();
