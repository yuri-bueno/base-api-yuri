#!/usr/bin/env node
const { execSync } = require("child_process");

function runCommand(command) {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
}

const repoName = process.argv[2];

const gitCheckoutCommand = `git clone --depth 1 https://github.com/yuri-bueno/base-api-yuri-starter ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

const checkedOut = runCommand(gitCheckoutCommand);
console.log("Clonando repositorio");
if (!checkedOut) process.exit(-1);
console.log("Instalando dependecias");
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);
console.log("Base montada com sucesso!");
