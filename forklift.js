#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { execSync } = require("child_process");

// Default configuration
const defaultConfig = {
  port: 8000,
};

async function parseEnvFile(envFilePath) {
  const envData = fs.readFileSync(envFilePath, "utf-8");
  const envLines = envData.split("\n");
  const envVars = [];

  envLines.forEach((line) => {
    const [key, value] = line.split("=");
    if (value.startsWith("$(") && value.endsWith(")")) {
      // It's a bash command, execute it
      const command = value.slice(2, -1);
      envVars.push(`${key}=${execSync(command).toString().trim()}`);
    } else {
      // It's a plain text value
      envVars.push(`${key}=${value}`);
    }
  });

  return envVars;
}

yargs(hideBin(process.argv))
  .command(
    "$0 <serviceName> <url>",
    "Generate Docker configuration files",
    (yargs) => {
      yargs
        .positional("serviceName", {
          describe: "the name of the service",
          type: "string",
        })
        .positional("url", {
          describe: "the URL of the service",
          type: "string",
        });
    },
    async (argv) => {
      const {
        serviceName,
        url,
        port,
        replicas,
        logLevel,
        envFile,
        routerName,
      } = argv;

      // Read the template files
      const dockerfileTemplate = fs.readFileSync(
        path.join(__dirname, "templates/Dockerfile.template"),
        "utf-8",
      );
      const dockerComposeTemplate = fs.readFileSync(
        path.join(__dirname, "templates/docker-compose.template.yml"),
        "utf-8",
      );

      let dockerfile = dockerfileTemplate
        .replace(/\$\{EXPOSE_PORT\}/, port)
        .replace(/\$\{SERVICE_NAME\}/g, serviceName);

      if (envFile) {
        const evaluatedEnvironmentVariables = await parseEnvFile(envFile);
        dockerfile += `\n\n# Environment Variables\nENV ${evaluatedEnvironmentVariables.join(
          " ",
        )}\n`;
      }

      const dockerCompose = dockerComposeTemplate
        .replace(/\$\{SERVICE_NAME\}/g, serviceName)
        .replace(/\$\{HOST\}/g, url)
        .replace(/\$\{SERVER_PORT\}/g, port)
        .replace(/\$\{ROUTER_NAME\}/g, routerName ? routerName : serviceName)
        .replace(/\$\{REPLICAS\}/g, replicas || 1)
        .replace(/\$\{SERVICE_NAME\}/g, serviceName)
        .replace(/\$\{LOG_LEVEL\}/g, logLevel || "ERROR")
        .replace(/\$\{CERT_RESOLVER\}/g, "qnzl");

      // Output the files to the current directory
      fs.writeFileSync(`./Dockerfile.${serviceName}`, dockerfile);
      fs.writeFileSync(`./docker-compose.${serviceName}.yml`, dockerCompose);
    },
  )
  .option("port", {
    describe: "the port the service will run on",
    default: defaultConfig.port,
    type: "number",
  })
  .option("router-name", {
    describe: "the router name",
    alias: "routerName",
    type: "string",
  })
  .option("replicas", {
    type: "number",
    description: "Set the number of replicas for the service",
  })
  .option("log-level", {
    type: "string",
    alias: "logLevel",
    description: "Set the log level for Traefik",
  })
  .option("env-file", {
    type: "string",
    alias: "envFile",
    description: "Path to the env file",
  })
  .help(false) // disable automatic help
  .version(false) // disable automatic version
  .option("help", {
    // create custom help option
    alias: "h",
    type: "boolean",
    description: "Show help",
  })
  .check((argv) => {
    if (argv.help) {
      console.log(`
Usage: $0 <serviceName> <url> [options]

Commands:
  $0 <serviceName> <url>  Generate Docker configuration files

Options:
  --port       The port the service will run on [default: 8000]
  --replicas   Set the number of replicas for the service
  --log-level  Set the log level for Traefik
  --env-file   Path to the env file
  -h, --help   Show help
`);
      process.exit(0);
    }
    return true;
  }).argv;
