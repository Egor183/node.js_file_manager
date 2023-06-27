import { EOL } from "node:os";

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

export const handleExit = (name, isNewLine) => {
  process.stdout.write(
    `${isNewLine ? EOL : ""}Thank you for using File Manager, ${name}, goodbye!`
  );
  process.exit();
};
