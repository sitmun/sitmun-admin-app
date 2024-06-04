# SITMUN Administration Application
![Build Status](https://github.com/sitmun/sitmun-admin-app/workflows/CI/badge.svg)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=org.sitmun%3Asitmun-admin-app&metric=alert_status)](https://sonarcloud.io/dashboard?id=org.sitmun%3Asitmun-admin-app)

The SITMUN Administration Application is a web-based application built using TypeScript, JavaScript, npm, and Angular.

## Common Build Arguments

**Environments:**

- Default (`src/environments/environment.ts`)
- Development (`src/environments/environment.testdeployment.ts`) 
- Production (`src/environments/environment.prod.ts`) 

**Variables:**

- `production`: Specifies if the environment is a production or a development enviroment. The default value is `false`.
- `apiBaseURL`: Specifies the base URL for the SITMUN Backend used by the aplication. The default value is `http://localhost:8080`. In the development environment points at `https://sitmun-backend-core.herokuapp.com`.

## Docker Support

The application is containerized using Docker, as defined in the Dockerfile. The Dockerfile is divided into two stages:

1. **Build Stage**: Based on Node.js, this stage is responsible for building and compiling the frontend of the application. 
   It uses npm to manage dependencies and Angular for building the application.
2. **Production Stage**: Based on Nginx, this stage serves the compiled application. 
   The compiled application from the build stage is copied into the Nginx container and served from the `/usr/share/nginx/html/` directory.

### Dockerfile Build Arguments

The Dockerfile for the SITMUN Administration Application takes three arguments during the build stage:

- `GITHUB_TOKEN`: A personal access token from GitHub used to authenticate with GitHub’s package registry when downloading dependencies.
- `BASE_HREF`: Specifies the base URL for the application, used by Angular for routing.
- `CONFIGURATION`: Specifies the build configuration for the Angular application (i.e. `testdeployment` and `prod`).

### Building the Docker Image

To build the Docker image for the SITMUN Administration Application, use the `docker build` command. 
This command includes the image name and any necessary build arguments.

Example command to build the Docker image:

```bash
docker build -t sitmun-admin-app --build-arg GITHUB_TOKEN=your_github_token --build-arg BASE_HREF=/ --build-arg CONFIGURATION=testdeployment .
```
Replace `your_github_token` with your actual GitHub token. Adjust the `BASE_HREF` and `CONFIGURATION` as needed.

### Starting the Application with Docker

To start the application, run the following command in the terminal:

```bash
docker run -p 80:80 sitmun-admin-app 
```

This command will start the SITMUN Administration Application and map port 80 in the container to port 80 on the host machine.
The application should now be accessible at http://localhost on your machine.

## Docker Compose Support

To deploy the SITMUN Administration Application using Docker Compose, create a `docker-compose.yml file that defines the services for your application.

### Steps to Create a docker-compose.yml File

1. Create a `docker-compose.yml` file in the root directory of your project. 
2. Define a service for the SITMUN Administration Application in the `docker-compose.yml` file. 
   This service should use the Docker image built from the `Dockerfile`, specify the ports to expose, and include any necessary environment variables or build arguments.
3. Start your application by running the `docker-compose up command in the terminal.

### Example docker-compose.yml File

```yaml
version: '3.8'
services:
  sitmun-admin-app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        GITHUB_TOKEN: your_github_token
        BASE_HREF: /
        CONFIGURATION: testdeployment
    ports:
      - "80:80"
 ```

Replace `your_github_token` with your actual GitHub token. Adjust the `BASE_HREF` and `CONFIGURATION` as needed.

### Starting the Application with Docker Compose

To start the application, run the following command in the terminal:

```bash
docker-compose up
```

This command will start the SITMUN Administration Application and map port 80 in the container to port 80 on the host machine. 
The application should now be accessible at http://localhost on your machine.

## Development Container support

A development container (or dev container for short) allows you to use a container as a full-featured development environment. 
The provided devcontainer file uses `mcr.microsoft.com/devcontainers/universal:2` and installs **node 12.1.1**.

```json
{
  "image": "mcr.microsoft.com/devcontainers/universal:2",
  "features": {
  },
  "postCreateCommand": "bash -i -c 'nvm install 12.11.1'"
}
```

### Development Build Arguments

The development for the SITMUN Administration Application takes three arguments during the build stage:

- `GITHUB_TOKEN`: A personal access token from GitHub used to authenticate with GitHub’s package registry when downloading dependencies.
- `BASE_HREF`: Specifies the base URL for the application, used by Angular for routing.
- `CONFIGURATION`: Specifies the build configuration for the Angular application (i.e. `testdeployment` and `prod`).

### Building the application

To build the application, run the following command in the terminal:

```bash
npm set //npm.pkg.github.com/:_authToken $our_github_token
npm ci
npm run build -- --configuration=testdeployment --baseHref=/
```

Replace `your_github_token` with your actual GitHub token. Adjust the `BASE_HREF` and `CONFIGURATION` as needed.

These commands will build the application. The output will be available in `dist/admin-app`.
