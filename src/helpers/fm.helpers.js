import { createInterface } from "node:readline";
import { EOL, homedir } from "node:os";
import {
  stateService,
  filesService,
  navigationService,
  cryptoService,
  zipService,
  osService,
} from "../services/index.js";
import { COMMANDS, INPUTS } from "../constants/index.js";
import { handleInputError } from "../utils.js";

const getName = () => {
  const nameArg = process.argv[2];
  const name = nameArg.substring(nameArg.indexOf("=") + 1) || "Anonymous";
  return name[0].toUpperCase() + name.substring(1);
};

export const printGreeting = (name) => {
  console.log(`Welcome to the File Manager, ${name}!`);
};

const printCurrentDirectoryPath = () => {
  process.stdout.write(`You are currently in ${process.cwd()}` + EOL);
};

export const handleFileManager = async () => {
  process.chdir(homedir());

  const name = getName();
  printGreeting(name);
  printCurrentDirectoryPath();

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (line) => {
    try {
      const [command, ...args] = line.trim().split(" ");
      switch (command) {
        case COMMANDS.EXIT:
          stateService.exit(name);
          break;
        case COMMANDS.CD:
          navigationService.changeDirectory(...args);
          break;
        case COMMANDS.UP:
          navigationService.goUp();
          break;
        case COMMANDS.LS:
          await filesService.getList();
          break;
        case COMMANDS.CAT:
          filesService.concatenate(...args);
          break;
        case COMMANDS.ADD:
          await filesService.addFile(...args);
          break;
        case COMMANDS.RN:
          await filesService.rename(...args);
          break;
        case COMMANDS.CP:
          filesService.copy(...args);
          break;
        case COMMANDS.MV:
          await filesService.move(...args);
          break;
        case COMMANDS.RM:
          await filesService.remove(...args);
          break;
        case COMMANDS.OS:
          await osService.handleOS(...args);
          break;
        case COMMANDS.HASH:
          await cryptoService.printSHA256FileHash(...args);
          break;
        case COMMANDS.COMPRESS:
          await zipService.compress(...args);
          break;
        case COMMANDS.DECOMPRESS:
          await zipService.decompress(...args);
          break;
        default:
          process.stdout.write(INPUTS.INVALID_COMMAND + EOL);
      }
    } catch (e) {
      handleInputError();
    } finally {
      printCurrentDirectoryPath();
    }

    rl.prompt();
  });

  rl.on("close", () => {
    stateService.exit(name);
    process.exit();
  });
};
