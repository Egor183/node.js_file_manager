import { readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { CONTENT_TYPES } from "../constants/index.js";
import {
  createReadStreamWithErrorHandling,
  createWriteStreamWithErrorHandling,
} from "../helpers/index.js";

export default class FilesService {
  async getList() {
    const content = await readdir(process.cwd(), { withFileTypes: true });

    // content is sorted in the next way: directories first + alphabetical order
    const sortedContent = content
      .map((item) => ({
        Name: item.name,
        Type: item.isFile() ? CONTENT_TYPES.FILE : CONTENT_TYPES.DIRECTORY,
      }))
      .sort(
        (a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name)
      );

    console.table(sortedContent);
  }

  concatenate(filePath) {
    const readStream = createReadStreamWithErrorHandling(filePath);
    readStream.pipe(process.stdout);
  }

  async addFile(filePath, content = "") {
    await writeFile(path.resolve(filePath), content, { flag: "wx" });
  }

  async rename(oldFilePath, newFilePath) {
    const oldFileAbsolutePath = path.resolve(oldFilePath);
    const newFileAbsolutePath = path.resolve(newFilePath);
    await rename(oldFileAbsolutePath, newFileAbsolutePath);
  }

  copy(oldFilePath, newFilePath) {
    const readStream = createReadStreamWithErrorHandling(oldFilePath);
    const writeStream = createWriteStreamWithErrorHandling(newFilePath);
    readStream.pipe(writeStream);
  }

  async remove(filePath) {
    await rm(path.resolve(filePath));
  }

  async move(oldFilePath, newFilePath) {
    this.copy(oldFilePath, newFilePath);
    await this.remove(oldFilePath);
  }
}
