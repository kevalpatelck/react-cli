#!/usr/bin/env node
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";

// React templates
import { simpleTodo as reactSimple } from "../templates/simple.js";
import { reduxTodo as reactRedux } from "../templates/redux.js";
import { hooksTodo as reactHooks } from "../templates/hooks.js";

// Placeholder imports for Vue/Vanilla
// import { simpleTodo as vueSimple } from "../templates/vue/simple.js";
// import { simpleTodo as vanillaSimple } from "../templates/vanilla/simple.js";

program
  .name("todo-cli")
  .description("CLI for generating Todo apps")
  .version("1.3.0");

function showBanner() {
  console.log(
    chalk.cyan(
      figlet.textSync("Todo CLI", {
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  console.log(chalk.green.bold("🚀 Welcome to the Todo App Generator CLI!\n"));
}

async function runInteractive() {
  showBanner();

  const { framework, language, template, name } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: chalk.yellow("👉 Choose your framework:"),
      choices: [
        { name: "⚛️ React", value: "react" },
        { name: "🟩 Vue", value: "vue" },
        { name: "📜 Vanilla JS", value: "vanilla" },
      ],
    },
    {
      type: "list",
      name: "language",
      message: chalk.yellow("👉 Choose your language:"),
      choices: [
        { name: "🟨 JavaScript", value: "javascript" },
        { name: "🔷 TypeScript", value: "typescript" },
      ],
    },
    {
      type: "list",
      name: "template",
      message: chalk.yellow("👉 Choose your todo template:"),
      choices: (answers) => {
        if (answers.framework === "react") {
          return [
            { name: "✨ Simple (Hooks)", value: "simple" },
            { name: "⚡ Redux", value: "redux" },
            { name: "🧩 Custom Hooks", value: "hooks" },
          ];
        }
        return [{ name: "✨ Simple", value: "simple" }];
      },
    },
    {
      type: "input",
      name: "name",
      message: chalk.yellow("👉 Enter project name:"),
      default: "my-todo",
    },
  ]);

  console.log(
    chalk.blueBright(
      `\n📦 Generating ${chalk.bold(template)} todo in ${chalk.bold(
        framework
      )} with ${chalk.bold(language)}...`
    )
  );

  // React templates
  if (framework === "react") {
    if (template === "simple") return reactSimple(name, language);
    if (template === "redux") return reactRedux(name, language);
    if (template === "hooks") return reactHooks(name, language);
  }

  // Vue templates
  if (framework === "vue") {
    console.log(chalk.red(`❌ Vue (${language}) templates coming soon!`));
  }

  // Vanilla templates
  if (framework === "vanilla") {
    console.log(
      chalk.red(`❌ Vanilla JS (${language}) templates coming soon!`)
    );
  }
}

program
  .command("init")
  .description("Interactive mode to choose framework, language, and todo type")
  .action(runInteractive);

if (process.argv.length <= 2) {
  await runInteractive();
} else {
  program.parse();
}
