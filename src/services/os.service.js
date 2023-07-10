import { EOL, arch, cpus, homedir, userInfo } from "node:os";
import { convertMHzToGHz } from "../utils.js";
import { INPUTS, OS_FLAGS } from "../constants/index.js";

export default class OSService {
  printEOL() {
    console.log(EOL);
  }

  printCPUS() {
    const cpusList = cpus().map((item) => ({
      Model: item.model,
      "Clock rate (GHz)": convertMHzToGHz(item.speed),
    }));

    console.log(`Overall amount of CPUS: ${cpusList.length}`);
    console.table(cpusList);
  }

  printHomeDir() {
    console.log(`Home directory: ${homedir()}`);
  }

  printUserName() {
    console.log(`User name: ${userInfo().username}`);
  }

  printCPUArchitecture() {
    console.log(`CPU architecture: ${arch()}`);
  }

  handleOS(flag) {
    switch (flag) {
      case OS_FLAGS.EOL:
        this.printEOL();
        break;
      case OS_FLAGS.CPUS:
        this.printCPUS();
        break;
      case OS_FLAGS.HOMEDIR:
        this.printHomeDir();
        break;
      case OS_FLAGS.USERNAME:
        this.printUserName();
        break;
      case OS_FLAGS.ARCHITECTURE:
        this.printCPUArchitecture();
        break;
      default:
        process.stdout.write(INPUTS.INVALID_COMMAND + EOL);
    }
  }
}
