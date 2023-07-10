import { EOL } from "node:os";
import { INPUTS } from "./constants/index.js";

export const sortInAlphabeticOrder = (arr) =>
  arr.sort((a, b) => a.value.localeCompare(b.value));

export const handleInputError = () => {
  process.stdout.write(INPUTS.ERROR + EOL);
};

export const convertMHzToGHz = (MHzValue) => MHzValue / 1000;
