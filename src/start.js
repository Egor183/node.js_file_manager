import { homedir, EOL } from "node:os";
import {
  printCurrentDirectoryPath,
  handleExit,
  printGreeting,
  getName,
  handleLS,
  handleCD,
  handleUP,
  handleCUT,
  handleADD,
  handleRN,
  handleCP,
  handleMV,
  handleRM,
  handleOS,
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
      const [command, ...args] = data.trim().split(" ");

      console.log(command, ...args);

      switch (command) {
        case ACTIONS.EXIT:
          handleExit(name);
          break;
        case ACTIONS.LS:
          await handleLS();
          break;
        case ACTIONS.CD:
          handleCD(...args);
          break;
        case ACTIONS.UP:
          handleUP();
          break;
        case ACTIONS.CUT:
          handleCUT(...args);
          break;
        case ACTIONS.ADD:
          handleADD(...args);
          break;
        case ACTIONS.RN:
          await handleRN(...args);
          break;
        case ACTIONS.CP:
          await handleCP(...args);
          break;
        case ACTIONS.MV:
          await handleMV(...args);
          break;
        case ACTIONS.RM:
          await handleRM(...args);
          break;
        case ACTIONS.OS:
          await handleOS(...args);
          break;
        default:
          process.stdout.write(INPUTS.INVALID_COMMAND + EOL);
      }
    } catch (e) {
      console.log(e);
      // process.stdout.write(INPUTS.ERROR + EOL);
    } finally {
      printCurrentDirectoryPath();
    }
  });
};

await startFileManager();
