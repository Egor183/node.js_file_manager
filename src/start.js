import { homedir, EOL } from "node:os";
import {
  printCurrentDirectoryPath,
  handleExit,
  printGreeting,
  getName,
  handleReaddir,
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

  process.stdin.on("data", async (data) => {
    try {
      const dataWithoutSpacesAndNewLines = data.replace(/\s/g, "");

      switch (dataWithoutSpacesAndNewLines) {
        case ACTIONS.EXIT:
          handleExit(name);
          break;
        case ACTIONS.LS:
          await handleReaddir();
          break;
        default:
          process.stdout.write(INPUTS.INVALID_COMMAND + EOL);
      }

      printCurrentDirectoryPath();
    } catch (e) {
      console.log(e);
      // process.stdout.write(INPUTS.ERROR + EOL);
    }
  });
};

await startFileManager();
