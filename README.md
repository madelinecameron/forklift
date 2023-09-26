# Forklift

Forklift is a slightly opinionated command-line tool for effortlessly generating Docker configuration files to use in a traefik config. With it, you can automate the creation of `Dockerfile` and `docker-compose.yml` files, making it faster and easier to deploy your services.

## Installation

You do not need to clone the repository or set up a Node.js environment to use Forklift. Instead, simply download the latest packaged distributable from the [Releases tab](https://github.com/madelinecameron/forklift/releases) in the GitHub repository. Choose the appropriate version for your operating system.

## Usage

After downloading, you can use Forklift directly from the command line:

```bash
forklift <serviceName> <url> [options]
```

## Example

```bash
forklift my-service http://example.com --port 3000 --replicas 3 --log-level INFO
```

This will generate Dockerfile.my-service and docker-compose.my-service.yml files configured with the specified options.
