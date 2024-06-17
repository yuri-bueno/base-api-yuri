#!/usr/bin/env node
const { execSync } = require("child_process");

const prompt = require("@clack/prompts");
const chalk = require("chalk");
const yargs = require("yargs");

let path;

async function runCommand(command, pathEnabled = true) {
  const usePath = pathEnabled ? `cd ${path} &&` : "";
  try {
    execSync(`${usePath} ${command}`, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    process.exit(-1);
    return false;
  }
  return true;
}

async function main() {
  const flags = yargs.argv;
  path = flags.path ?? flags.p;

  prompt.intro(`🔰 ${chalk.bgGreen("Inicializador zac-api")}`);
  if (flags.all || flags.a) {
    return templateAll({ path });
  }

  if (!path) {
    path = await prompt.text({
      message: "Escolha o local do arquivo",
      placeholder: ".",
      defaultValue: ".",
    });
  }

  const modules = await prompt.multiselect({
    message: "Modulos adicionais:",
    options: [
      { label: "format-params", value: "format-params", hint: "Recomendado" },
      { label: "auth", value: "auth" },
      { label: "multer", value: "multer" },
    ],
    required: false,
  });

  const ORM = await prompt.select({
    message: "Escolha o ORM:",
    options: [
      { label: "Prisma", value: "prisma", hint: "Recomendado" },
      { label: "Nenhum", value: null },
    ],
  });

  let selectedDB;

  if (ORM) {
    selectedDB = await prompt.select({
      message: "Escolha o ORM:",
      options: [
        { label: "SQLite", value: "sqlite" },
        { label: "MySQL", value: "mysql" },
        { label: "PostgreSQL", value: "postgresql" },
        { label: "MongoDB", value: "mongodb" },
        { label: "SQL Server", value: "sqlserver" },
        { label: "CockroachDB", value: "cockroachdb" },
      ],
    });
  }

  const spinner1 = prompt.spinner();
  spinner1.start("Baixando template...");

  const gitCheckoutCommand = `git clone  --quiet --depth 1 https://github.com/yuri-bueno/base-api-yuri-starter ${path}`;
  const checkedOut = runCommand(gitCheckoutCommand, false);

  spinner1.stop("Template baixado.");

  switch (ORM) {
    case "prisma":
      runCommand(`npm install prisma --silent --save-dev`);
      runCommand(`npx prisma init --datasource-provider ${selectedDB} `);
      break;

    default:
      break;
  }
}
function templateAll() {
  const spinner1 = prompt.spinner();
  spinner1.start("Baixando template...");

  const gitCheckoutCommand = `git clone  --quiet --depth 1 https://github.com/yuri-bueno/base-api-yuri-starter ${path}`;
  const checkedOut = runCommand(gitCheckoutCommand);

  spinner1.stop("Template baixado.");

  const spinner2 = prompt.spinner();
  spinner2.start("Installando pacotes...");

  const installDepsCommand = `npm install --silent`;
  const installedDeps = runCommand(installDepsCommand);

  spinner2.stop("Pacotes instalados.");
}

main();
