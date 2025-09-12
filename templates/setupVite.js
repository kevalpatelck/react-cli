import { execSync } from "child_process";
import path from "path";

export function setupProject(projectName) {
  console.log("⚡ Creating Vite React app...");
  execSync(`npm create vite@latest ${projectName} -- --template react`, {
    stdio: "inherit",
  });

  const projectPath = path.join(process.cwd(), projectName);
  return projectPath;
}
