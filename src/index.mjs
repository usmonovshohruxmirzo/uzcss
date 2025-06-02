import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import fg from "fast-glob";
import fsExtra from "fs-extra";

import { properties, values } from "../config/uzcss.config.mjs";

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translateCss(cssContent) {
  let translatedCss = cssContent;

  for (const [uz, en] of Object.entries(properties)) {
    const regex = new RegExp(`\\b${escapeRegex(uz)}\\b(?=\\s*:)`, "g");
    translatedCss = translatedCss.replace(regex, en);
  }

  for (const [uz, en] of Object.entries(values)) {
    const regex = new RegExp(`(:\\s*)${escapeRegex(uz)}\\b`, "g");
    translatedCss = translatedCss.replace(regex, `$1${en}`);
  }

  return translatedCss;
}

async function main() {
  const inputGlobPatterns = process.argv.slice(2, -1);
  const outputBaseDir = process.argv[process.argv.length - 1];

  if (inputGlobPatterns.length === 0 || !outputBaseDir) {
    console.error(
      chalk.red(
        `❌ Foydalanish: node src/index.mjs <kiritma_fayl_naqshlari...> <chiqish_papka>`
      )
    );
    console.error(
      chalk.yellow(`Misol: node src/index.mjs "styles/**/*.uzcss" "dist"`)
    );
    process.exit(1);
  }

  console.log(chalk.blue(`🔍 Qidirilmoqda: ${inputGlobPatterns.join(", ")}`));
  console.log(chalk.blue(`📂 Chiqish papkasi: ${outputBaseDir}`));

  try {
    const files = await fg(inputGlobPatterns, {
      dot: true,
      onlyFiles: true,
      unique: true,
    });

    if (files.length === 0) {
      console.warn(chalk.yellow("⚠️ Mos keladigan .uzcss fayllar topilmadi."));
      return;
    }

    console.log(chalk.cyan(`📄 Topilgan ${files.length} ta .uzcss fayl:`));
    files.forEach((file) => console.log(chalk.gray(`- ${file}`)));

    for (const inputFilePath of files) {
      try {
        const uzcssContent = await fs.readFile(inputFilePath, "utf-8");

        const translatedCssContent = translateCss(uzcssContent);

        const relativeInputPath = path.relative(process.cwd(), inputFilePath);
        const outputFileName = path.basename(inputFilePath, ".uzcss") + ".css";
        const outputDir = path.join(
          outputBaseDir,
          path.dirname(relativeInputPath)
        );

        await fsExtra.ensureDir(outputDir);

        const outputFilePath = path.join(outputDir, outputFileName);

        await fs.writeFile(outputFilePath, translatedCssContent);

        console.log(chalk.green(`✅ Tarjima yakunlandi: ${outputFilePath}`));
      } catch (fileError) {
        console.error(
          chalk.red(
            `❌ "${inputFilePath}" faylini qayta ishlashda xato: ${fileError.message}`
          )
        );
      }
    }

    console.log(
      chalk.green("\n🎉 Barcha fayllar muvaffaqiyatli tarjima qilindi!")
    );
  } catch (error) {
    console.error(chalk.red(`\n❌ Umumiy xato: ${error.message}`));
    process.exit(1);
  }
}

main();
