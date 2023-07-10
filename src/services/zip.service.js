import { createGunzip, createGzip } from "node:zlib";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import {
  createReadStreamWithErrorHandling,
  createWriteStreamWithErrorHandling,
} from "../helpers/index.js";

export default class ZipService {
  constructor() {
    this.promisifiedPipeline = promisify(pipeline);
  }

  getStreams(readStreamPath, writeStreamPath) {
    const readStream = createReadStreamWithErrorHandling(readStreamPath);
    const writeStream = createWriteStreamWithErrorHandling(writeStreamPath, {
      flags: "wx",
    });

    return { readStream, writeStream };
  }

  async compress(pathToFile, pathToArchive) {
    const { readStream, writeStream } = this.getStreams(
      pathToFile,
      pathToArchive
    );

    await this.promisifiedPipeline(readStream, createGzip(), writeStream);
  }

  async decompress(pathToArchive, pathToFile) {
    const { readStream, writeStream } = this.getStreams(
      pathToArchive,
      pathToFile
    );

    await this.promisifiedPipeline(readStream, createGunzip(), writeStream);
  }
}
