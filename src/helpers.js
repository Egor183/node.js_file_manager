import { EOL, cpus, homedir, userInfo, arch } from "node:os";
import { createReadStream, createWriteStream, statSync } from "node:fs";
import { readdir, rename, rm, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { createGzip } from "node:zlib";
import { sortInAlphabeticOrder } from "./utils.js";
import { CONTENT_TYPES, INPUTS, OS_FLAGS } from "./constants.js";

const promisifiedPipeline = promisify(pipeline);

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

export const handleRN = async (oldFilePath, newFilePath) => {
  const newFileAbsolutePath = path.resolve(newFilePath);
  const oldFileAbsolutePath = path.resolve(oldFilePath);
  await rename(oldFileAbsolutePath, newFileAbsolutePath);
};

// CP

export const handleCP = (oldFilePath, newFileName) => {
  const readStream = createReadStream(path.resolve(oldFilePath));
  const writeStream = createWriteStream(path.resolve(newFileName));
  readStream.pipe(writeStream);
};

// RM

export const handleRM = async (filePath) => {
  const fileAbsolutePath = path.resolve(filePath);
  await rm(fileAbsolutePath);
};

// MV

export const handleMV = async (oldFilePath, newFilePath) => {
  handleCP(oldFilePath, newFilePath);
  await handleRM(oldFilePath);
};

// OS

export const handleOS = (flag) => {
  switch (flag) {
    case OS_FLAGS.EOL:
      handleEOL();
      break;
    case OS_FLAGS.CPUS:
      handleCPUS();
      break;
    case OS_FLAGS.HOMEDIR:
      handleHOMEDIR();
      break;
    case OS_FLAGS.USERNAME:
      handleUSERNAME();
      break;
    case OS_FLAGS.ARCHITECTURE:
      handleARCHITECTURE();
      break;
    default:
      process.stdout.write(INPUTS.INVALID_COMMAND + EOL);
  }
};

const handleEOL = () => {
  console.log(EOL);
};

const handleCPUS = () => {
  console.log(cpus());
};

const handleHOMEDIR = () => {
  console.log(homedir());
};

const handleUSERNAME = () => {
  console.log(userInfo().username);
};

const handleARCHITECTURE = () => {
  console.log(arch());
};

// HASH

export const handleHASH = async (filePath) => {
  const data = await readFile(path.resolve(filePath));

  let hex = createHash("sha256").update(data).digest("hex");
  console.log(hex);
};

// COMPRESS

export const handleCOMPRESS = async (pathToFile, pathToArchive) => {
  const inputStream = createReadStream(pathToFile);
  const outputStream = createWriteStream(pathToArchive);
  const gzip = createGzip();
  await promisifiedPipeline(inputStream, gzip, outputStream);
};
