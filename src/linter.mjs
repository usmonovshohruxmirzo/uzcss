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
        const keys = Object.keys(properties);

        const prefix = propertyName.slice(0, 4);
        const suggestion =
          keys.find((key) => key.startsWith(prefix)) ||
          keys.find((key) => key.startsWith(propertyName.slice(0, 3))) ||
          keys.find((key) => key.startsWith(propertyName.slice(0, 2))) ||
          null;

        const suggestionText = suggestion
          ? `Ehtimol siz "${suggestion}" degan xususiyatni nazarda tutgandirsiz?`
          : "Shunga o‘xshash xususiyat topilmadi.";

        console.log(
          chalk.yellow(
            `⚠️  Noto\`g\`ri xususiyat: "${chalk.underline(
              propertyName
            )}" faylda: ${chalk.cyan(
              `${filePath}:${i + 1}`
            )}. ${suggestionText}`
          )
        );

        hasError = true;
      }
    }
  }

  if (!hasError) {
    console.log(
      chalk.green("✅ Hammasi joyida! Hech qanday xatolik topilmadi.")
    );
  }
}

function getHasError() {
  return hasError;
}

export { uzcssLinter, getHasError };
