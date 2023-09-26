# Forklift

Forklift is a slightly opinionated command-line tool for effortlessly generating Docker configuration files to use with Traefik. With Forklift, you can automate the creation of `Dockerfile` and `docker-compose.yml` files, making it faster and easier to deploy your services.

## Installation

After cloning the repo, ensure you have `jq` installed, which is used to parse the configuration file. You can install it using the following commands based on your operating system:

For Ubuntu/Debian:

```bash
sudo apt-get install jq
```

For macOS:

```bash
brew install jq
```

---

Run:

```bash
make install
```

This will install `forklift` into ~/bin (or make it if necessary). Ensure ~/bin is in your $PATH. In addition, it will write the templates and config to ~/.config/forklift.

## Post-Installation Configuration

After installing Forklift, you should modify the forklift.json file located in ~/.config/forklift. This file contains default settings for NETWORK_NAME and CERT_RESOLVER.

## Usage

After downloading and setting up the configuration file, you can use Forklift directly from the command line:

```bash
forklift <serviceName> <url> [options]
```

## Options

- --port : The port the service will run on (default: 8000).
- --router-name : The router name. If not defined, the serviceName is used.
- --replicas : Set the number of replicas for the service.
- --log-level : Set the log level for Traefik.
- --env-file : Path to the environment file.
- --cert-resolver : Certificate resolver. Defaults to the value in forklift.json.
- --network-name : Network name. Defaults to the value in forklift.json.
- -h, --help : Show help.

## Example

```bash
forklift my-service http://example.com --port 3000 --replicas 3 --log-level INFO
```

This command will generate Dockerfile.my-service and docker-compose.my-service.yml files configured with the specified options.
