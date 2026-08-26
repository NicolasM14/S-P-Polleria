import { copyFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const envExample = join(root, ".env.example");
const envLocal = join(root, ".env.local");

if (!existsSync(envLocal) && existsSync(envExample)) {
  copyFileSync(envExample, envLocal);
  console.log("Created .env.local from .env.example — edit your Supabase keys.");
} else if (existsSync(envLocal)) {
  console.log(".env.local already exists — skipped.");
}

console.log("Installing dependencies...");
const install = spawnSync("npm", ["install"], { stdio: "inherit", shell: true });

if (install.status !== 0) {
  process.exit(install.status ?? 1);
}

console.log("\nSetup complete. Next: edit .env.local, then run npm run dev");
