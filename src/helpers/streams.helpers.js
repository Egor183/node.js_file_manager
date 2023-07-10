import { createReadStream, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { handleInputError } from "../utils.js";

const handleStreamError = (stream) => {
  stream.on("error", handleInputError);
};

export const createReadStreamWithErrorHandling = (filePath) => {
  const readStream = createReadStream(resolve(filePath));
  handleStreamError(readStream);

  return readStream;
};

export const createWriteStreamWithErrorHandling = (filePath) => {
  const writeStream = createWriteStream(resolve(filePath), {
    flags: "wx",
  });
  handleStreamError(writeStream);

  return writeStream;
};
