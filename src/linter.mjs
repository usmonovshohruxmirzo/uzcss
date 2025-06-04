import chalk from "chalk";
import { properties } from "./config/uzcss.config.mjs";

let hasError = false;

function uzcssLinter(cssContent, filePath) {
  const lines = cssContent.split(/\r?\n/);
  const propRegex = /^([\w-]+)\s*:\s*(.+);$/;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (
      line === "" ||
      line.includes("{") ||
      line.includes("}") ||
      line.startsWith("//") ||
      line.startsWith("/*")
    )
      continue;

    const match = line.match(propRegex);

    if (match) {
      const propertyName = match[1];

      const isValid = Object.prototype.hasOwnProperty.call(
        properties,
        propertyName
      );

      if (!isValid) {
        console.log(
          chalk.yellow(
            `⚠️  Unknown property: "${chalk.underline(
              propertyName
            )}" at ${chalk.cyan(`${filePath}:${i + 1}`)}`
          )
        );
        hasError = true;
      }
    }
  }
}

function getHasError() {
  return hasError;
}

export { uzcssLinter, getHasError };
