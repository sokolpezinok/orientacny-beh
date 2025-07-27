import chalk from "chalk";
import { readFileSync } from "fs";
import { globSync } from "glob";
import { basename, extname, resolve } from "path";

/*
Automatically searches in source and checks for missing and unused properties taking into account plurals.
Capable finding properties of following formats:

t("foo.bar.baz")            => foo.bar.baz
t('foo')                    => foo
t('foo', {count: 1})        => foo
<Trans i18nKey="foo" ... /> => foo

Does not match:

import("foo/bar.baz")
*/

const sourceFiles = "./src/**/*.{js,jsx}";
const internalizationFiles = "./src/i18n/resources/*.js";

const regex = /[^\w](?:t\(|i18nKey=)["']([^"']+)["']/g;
const pluralSuffixes = ["_zero", "_one", "_few", "_other"];

// -------------------------------------------------- //

const translations = [];

for (const file of globSync(sourceFiles)) {
  const content = readFileSync(file, "utf-8");

  for (const [, key] of content.matchAll(regex)) {
    translations.push({ property: key, file });
  }
}

function removePluralSuffixes(value) {
  for (const suffix of pluralSuffixes) {
    const index = value.lastIndexOf(suffix);

    if (index === -1) {
      continue;
    }

    return value.substr(0, index);
  }

  return value;
}

function flatten(object, prefix = "", result = new Set()) {
  for (const key in object) {
    if (!Object.hasOwn(object, key)) continue;

    const value = object[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      flatten(value, path, result);
    } else {
      // plurals are handled elsewhere
      result.add(removePluralSuffixes(path));
    }
  }

  return result;
}

for (const file of globSync(internalizationFiles)) {
  const locale = basename(file, extname(file));

  console.log(`Analyzing locale ${chalk.bold(locale)} ...`);
  console.log();

  const { default: resource } = await import(resolve(file));
  const flattened = flatten(resource);
  const unused = new Set(flattened);
  const problems = [];
  const plurals = [];

  for (const { property, file } of translations) {
    unused.delete(property);

    if (flattened.has(property)) continue;

    const matches = pluralSuffixes.map((suffix) => flattened.has(property + suffix));

    if (matches.some(Boolean)) {
      if (!matches.every(Boolean)) {
        plurals.push({ property, file });
      }
      continue;
    }

    problems.push({ property, file });
  }

  if (problems.length) {
    console.log();
    console.log(`Found ${chalk.red(`${problems.length} missing properties`)} in locale ${chalk.bold(locale)} (${chalk.dim(file)}):`);
    for (const { property, file } of problems) {
      console.log(`╰ '${chalk.yellow(property)}' from (${chalk.dim(file)})`);
    }
  } else {
    console.log(`✨ Awesome! No missing properties found in locale ${chalk.bold(locale)} (${chalk.white.dim(file)})!`);
  }

  if (plurals.length) {
    console.log();
    console.log(`Found missing plural suffixes (expected: ${pluralSuffixes.map((s) => chalk.bold(s)).join(", ")}) for following properties in locale ${chalk.bold(locale)} (${chalk.dim(file)}):`);
    for (const { property, file } of plurals) {
      console.log(`╰ '${chalk.yellow(property)}' from (${chalk.dim(file)})`);
    }
  }

  const unusedArray = Array.from(unused);

  if (unusedArray.length) {
    console.log();
    console.log(`Found ${chalk.red(`${unusedArray.length} unused properties`)} in locale ${chalk.bold(locale)} (${chalk.dim(file)}):`);
    for (const property of unusedArray) {
      console.log(`╰ '${chalk.yellow(property)}'`);
    }
  } else {
    console.log(`✨ Perfect! No unused properties found in locale ${chalk.bold(locale)} (${chalk.white.dim(file)})!`);
  }
}
