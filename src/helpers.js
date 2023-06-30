import { EOL } from "node:os";
import { createReadStream, createWriteStream, statSync } from "node:fs";
import { readdir, rename } from "node:fs/promises";
import path from "node:path";
import { writeFile } from "node:fs/promises";
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
  const readStream = createReadStream(path.resolve(filePath));
  readStream.pipe(process.stdout);
};

// ADD

export const handleADD = async (filename) => {
  await writeFile(filename, "");
};

// RM

export const handleRN = async (oldFilePath, newFileName) => {
  const newFileAbsolutePath = path.resolve(oldFilePath, "..", newFileName);
  const oldFileAbsolutePath = path.resolve(oldFilePath);
  await rename(oldFileAbsolutePath, newFileAbsolutePath);
};

// CP

export const handleCP = (oldFilePath, newFileName) => {
  const readStream = createReadStream(path.resolve(oldFilePath));
  const writeStream = createWriteStream(path.resolve(newFileName));
  readStream.pipe(writeStream);
};
