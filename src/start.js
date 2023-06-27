import { homedir, EOL } from "node:os";
import {
  printCurrentDirectoryPath,
  handleExit,
  printGreeting,
  getName,
} from "./helpers.js";
import { ACTIONS, INPUTS } from "./constants.js";

const startFileManager = async () => {
  process.chdir(homedir());

  const name = getName();
  printGreeting(name);
  printCurrentDirectoryPath();

  process.stdin.setEncoding("utf-8");

  process.on("SIGINT", () => {
    handleExit(name, true);
  });

  process.stdin.on("data", (data) => {
    const dataWithoutSpacesAndNewLines = data.replace(/\s/g, "");

    switch (dataWithoutSpacesAndNewLines) {
      case ACTIONS.EXIT:
        handleExit(name);
        break;
      default:
        process.stdout.write(INPUTS.INVALID_COMMAND + EOL);
    }

    printCurrentDirectoryPath();
  });

  process.stdin.on("error", () => {
    process.stdout.write(INPUTS.ERROR + EOL);
  });
};

await startFileManager();
