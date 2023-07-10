import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

export default class CryptoService {
  async printSHA256FileHash(filePath) {
    const data = await readFile(path.resolve(filePath));

    let hex = createHash("sha256").update(data).digest("hex");
    console.log(hex);
  }
}
