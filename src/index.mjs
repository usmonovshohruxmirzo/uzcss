import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import fg from "fast-glob";
import fsExtra from "fs-extra";
import {
  atRuleReplacements,
  functionsReplacements,
  properties,
  values,
} from "./config/uzcss.config.mjs";

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function emptyLine() {
  console.log();
}

function translateCss(cssContent) {
  let translatedCss = cssContent;

  const sortedFunctions = Object.entries(functionsReplacements).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [uz, en] of sortedFunctions) {
    const funcRegex = new RegExp(`\\b${escapeRegex(uz)}(?=\\()`, "g");
    translatedCss = translatedCss.replace(funcRegex, en);
  }

  for (const [uz, en] of Object.entries(atRuleReplacements)) {
    const regex = new RegExp(escapeRegex(uz), "g");
    translatedCss = translatedCss.replace(regex, en);
  }

  const sortedProperties = Object.entries(properties).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [uz, en] of sortedProperties) {
    const regex = new RegExp(`\\b${escapeRegex(uz)}\\b(?=\\s*:)`, "g");
    translatedCss = translatedCss.replace(regex, en);
  }

  const sortedValues = Object.entries(values).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [uz, en] of sortedValues) {
    const regex = new RegExp(`\\b${escapeRegex(uz)}\\b`, "g");
    translatedCss = translatedCss.replace(regex, en);
  }

  return translatedCss;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(
      chalk.red(
        `❌ Foydalanish: node src/index.mjs <kiritma_fayl_naqshlari...> <chiqish_papka>`
      )
    );
    console.error(
      chalk.yellow(`Misol: node src/index.mjs "styles/**/*.uzcss" "dist"`)
    );
    console.error(
      chalk.yellow(
        `Yoki: node src/index.mjs "styles/main.uzcss" "styles/components/*.uzcss" "dist"`
      )
    );
    process.exit(1);
  }

  const inputGlobPatterns = args.slice(0, -1);
  const outputBaseDir = args[args.length - 1];

  console.log(chalk.blue(`🔍 Qidirilmoqda: ${inputGlobPatterns.join(", ")}`));
  emptyLine();
  console.log(chalk.blue(`📂 Chiqish papkasi: ${outputBaseDir}`));
  emptyLine();

  try {
    const files = await fg(inputGlobPatterns, {
      dot: true,
      onlyFiles: true,
      unique: true,
      absolute: false,
    });

    if (files.length === 0) {
      console.warn(chalk.yellow("⚠️ Mos keladigan .uzcss fayllar topilmadi."));
      console.log(chalk.gray("Qidirilgan naqshlar:"));
      inputGlobPatterns.forEach((pattern) =>
        console.log(chalk.gray(`  - ${pattern}`))
      );
      return;
    }

    console.log(chalk.cyan(`📄 Topilgan ${files.length} ta .uzcss fayl:`));
    files.forEach((file) => console.log(chalk.gray(`  - ${file}`)));
    emptyLine();

    let successCount = 0;
    let errorCount = 0;

    for (const inputFilePath of files) {
      try {
        const uzcssContent = await fs.readFile(inputFilePath, "utf-8");

        if (uzcssContent.trim() === "") {
          console.warn(chalk.yellow(`⚠️ Bo'sh fayl: ${inputFilePath}`));
          continue;
        }

        const translatedCssContent = translateCss(uzcssContent);

        const outputFileName = path.basename(inputFilePath, ".uzcss") + ".css";
        const inputDir = path.dirname(inputFilePath);
        const outputDir = path.join(outputBaseDir, inputDir);

        await fsExtra.ensureDir(outputDir);

        const outputFilePath = path.join(outputDir, outputFileName);

        await fs.writeFile(outputFilePath, translatedCssContent, "utf-8");

        console.log(chalk.green(`✅ ${inputFilePath} → ${outputFilePath}`));

        successCount++;
      } catch (fileError) {
        console.error(
          chalk.red(
            `❌ "${inputFilePath}" faylini qayta ishlashda xato: ${fileError.message}`
          )
        );
        errorCount++;
      }
    }

    emptyLine();
    if (successCount > 0) {
      console.log(
        chalk.green(
          `🎉 ${successCount} ta fayl muvaffaqiyatli tarjima qilindi!`
        )
      );
    }
    if (errorCount > 0) {
      console.log(chalk.red(`❌ ${errorCount} ta faylda xato yuz berdi.`));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ Umumiy xato: ${error.message}`));
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  console.log(chalk.yellow("\n\n⏹️ Jarayon to'xtatildi."));
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error(chalk.red("\n❌ Kutilmagan xato:"), error.message);
  process.exit(1);
});

main();
