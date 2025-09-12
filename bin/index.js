#!/usr/bin/env node
import { program } from "commander";
import { simpleTodo } from "../templates/simple.js";
import { reduxTodo } from "../templates/redux.js";
import { hooksTodo } from "../templates/hooks.js";
import inquirer from "inquirer";

program
  .name("todo-cli")
  .description("CLI for generating React Todo apps")
  .version("1.0.0");

program
  .command("simple <projectName>")
  .description("Generate simple todo using hooks")
  .action(simpleTodo);

program
  .command("redux <projectName>")
  .description("Generate advanced todo using redux")
  .action(reduxTodo);

program
  .command("hooks <projectName>")
  .description("Generate advanced todo using custom hooks")
  .action(hooksTodo);

async function runInteractive() {
  const { choice, name } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Choose todo type:",
      choices: ["simple", "redux", "hooks"],
    },
    {
      type: "input",
      name: "name",
      message: "Enter project name:",
      default: "my-todo",
    },
  ]);
  if (choice === "simple") simpleTodo(name);
  if (choice === "redux") reduxTodo(name);
  if (choice === "hooks") hooksTodo(name);
}

program
  .command("init")
  .description("Interactive mode to choose todo type")
  .action(runInteractive);

if (process.argv.length <= 2) {
  // No subcommand provided; start interactive mode
  await runInteractive();
} else {
  program.parse();
}
