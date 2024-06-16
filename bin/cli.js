#!/usr/bin/env node
const { execSync } = require("child_process");

function runCommand(Command) {}

const repoName = process.argv[2];

const gitCheckoutCommand = `git clone --depth 1  ${repoName}`;
