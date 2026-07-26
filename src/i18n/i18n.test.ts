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

const sourceFiles = globSync("./src/**/*.{js,jsx,ts,tsx}", { ignore: ["**/*.test.*"] });
const internalizationFiles = globSync("./src/i18n/resources/*.{js,ts}");

const REGEX = /[^\w](?:t\(|i18nKey=)["']([^"']+)["']/g;
const PLURALS = ["_zero", "_one", "_few", "_other"];

// -------------------------------------------------- //

type PropertyType = {
  name: string;
  // where the property is used
  file: string;
};

const translations: PropertyType[] = [];

for (const file of sourceFiles) {
  const content = readFileSync(file, "utf-8");

  for (const [, name] of content.matchAll(REGEX)) {
    translations.push({ name, file });
  }
}

function removePluralSuffixes(value: string) {
  for (const suffix of PLURALS) {
    const index = value.lastIndexOf(suffix);

    if (index === -1) {
      continue;
    }

    return value.slice(0, index);
  }

  return value;
}

function flatten(object: Record<string, any>, prefix = "", result = new Set<string>()) {
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

function combineProperties(properties: PropertyType[]) {
  return properties.map((property) => `╰ '${chalk.yellow(property.name)}' from (${chalk.dim(property.file)})`).join("\n");
}

function error(message: string, properties: PropertyType[]) {
  // TESTERS, this line correct, read the error above
  throw new Error(`${message}\n` + combineProperties(properties));
}

function warn(message: string, properties: PropertyType[]) {
  console.log(chalk.yellow(`${message}\n`) + chalk.white(combineProperties(properties)));
}

describe("i18n", () => {
  for (const file of internalizationFiles) {
    const locale = basename(file, extname(file));

    it(`Analyzing locale ${chalk.bold(locale)} (${chalk.dim(file)})`, async () => {
      const { default: resource } = await import(resolve(file));

      const flattened = flatten(resource);
      const unused = new Set(flattened);

      const problems: PropertyType[] = [];
      const plurals: PropertyType[] = [];

      for (const { name, file } of translations) {
        unused.delete(name);

        if (flattened.has(name)) continue;

        const matches = PLURALS.map((suffix) => flattened.has(name + suffix));

        if (matches.some(Boolean)) {
          if (!matches.every(Boolean)) {
            plurals.push({ name, file });
          }
          continue;
        }

        problems.push({ name, file });
      }

      /**
       * Unused properties
       */
      const unusedProperties = Array.from(unused).map((name) => ({ name, file }));

      if (unusedProperties.length) {
        warn(`Found ${chalk.red(`${unusedProperties.length} unused properties`)}:`, unusedProperties);
      }

      /**
       * Missing properties
       */
      if (problems.length) {
        error(`Found ${chalk.red(`${problems.length} missing properties`)}:`, problems);
      }

      /**
       * Missing plural suffixes
       */

      if (plurals.length) {
        error(`Found missing plural suffixes (expected: ${PLURALS.map((s) => chalk.bold(s)).join(", ")}) for following properties:`, plurals);
      }
    });
  }
});
