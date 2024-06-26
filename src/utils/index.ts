import chalk from "chalk";
import { join } from "node:path";
import { cwd } from "node:process";

export const log = {
  success: (text: string) =>
    console.log(
      chalk.black(`${chalk.bgGreenBright("[OK]")}: ${chalk.green(text)}`)
    ),
  info: (text: string) =>
    console.log(
      chalk.black(`${chalk.bgCyanBright("[INFO]")}: ${chalk.cyan(text)}`)
    ),
  warn: (text: string) =>
    console.log(
      chalk.black(`${chalk.bgYellowBright("[WARN]")}: ${chalk.yellow(text)}`)
    ),
  error: (text: string) =>
    console.log(
      chalk.black(`${chalk.bgRedBright(["ERROR"])}: ${chalk.red(text)}`)
    ),
};

export const __rootname = cwd();
export const rootTo = (...path: string[]) => join(__rootname, ...path);
