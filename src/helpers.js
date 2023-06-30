import { EOL } from "node:os";
import { createReadStream, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { sortInAlphabeticOrder } from "./utils.js";
import { CONTENT_TYPES } from "./constants.js";

export const getName = () => {
  const nameArg = process.argv[3];
  const name = nameArg.substring(nameArg.indexOf("=") + 1) || "Anonymous";
  return name[0].toUpperCase() + name.substring(1);
};

export const printGreeting = (name) => {
  process.stdout.write(`Welcome to the File Manager, ${name}!` + EOL);
};

export const printCurrentDirectoryPath = () => {
  process.stdout.write(`You are currently in ${process.cwd()}` + EOL);
};

// EXIT

export const handleExit = (name, isNewLine) => {
  process.stdout.write(
    `${isNewLine ? EOL : ""}Thank you for using File Manager, ${name}, goodbye!`
  );
  process.exit();
};

// LS

const getSortedDirContent = async () => {
  const content = await readdir(process.cwd());

  const { directories, files } = content.reduce(
    (res, acc) => {
      const isDirectory = statSync(acc).isDirectory();
      isDirectory
        ? res.directories.push({
            value: acc,
            type: CONTENT_TYPES.DIRECTORY,
          })
        : res.files.push({
            value: acc,
            type: CONTENT_TYPES.FILE,
          });

      return res;
    },
    {
      directories: [],
      files: [],
    }
  );

  return [
    ...sortInAlphabeticOrder(directories),
    ...sortInAlphabeticOrder(files),
  ];
};

export const printTable = (content) => {
  const data = content.map((item) => ({
    Name: item.value,
    Type: item.type,
  }));

  console.table(data);
};

export const handleLS = async () => {
  const content = await getSortedDirContent();
  printTable(content);
};

// CD

export const handleCD = (directory) => {
  process.chdir(path.resolve(directory));
};

// UP

export const handleUP = () => {
  process.chdir(path.resolve(process.cwd(), ".."));
};

// CUT

export const handleCUT = (filePath) => {
  console.log(path.resolve(filePath));
  const readStream = createReadStream(path.resolve(filePath));
  readStream.pipe(process.stdout);
};
