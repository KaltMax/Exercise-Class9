# Class 9 Evaluated Exercise

## Table of Contents

* [Prerequisites](#prerequisites)
* [Local Development](#local-development)
* [Production Deployment](#production-deployment)
  * [Using Docker Compose](#using-docker-compose)
  * [Using Docker Run](#using-docker-run)
* [CI/CD Pipeline](#cicd-pipeline)
* [NPM Scripts](#npm-scripts)
* [Environment Variables](#environment-variables)
  * [Adding new Environment Variables](#adding-new-environment-variables)
* [Add A New Migration](#add-a-new-migration)

## Prerequisites

* Docker Engine >=v20.10.24
* Docker Compose >=v2.17.2
* Nodejs >=v22.14.0

## Local Development

Prepare your local development environment with a single command:

```sh
npm run setup:dev
```

This command will do the following for you:
* Removes and reinstalls the node_modules with `npm run cleanup:dev`
* Stops all previous containers with `npm run setdown:dev`
* Spin up the database with `docker compose --file local-compose.yaml up --detach`
* Generate the types from the Prisma Schema for your database with `npm run prisma:generate:dev`
* Run all database migrations so your database is always on the latest schema with `npm run migrate:dev`

If you want to stop all containers after developing you can run:

```sh
npm run setdown:dev
```

Start the server with:

```sh
npm run start:dev
```

You can now visit [http://localhost:5000/ping](http://localhost:5000/ping) and start developing.

## Production Deployment

### Using Docker Compose

Start the application in production with:

```sh
docker compose up --build
```

This command will spin up:
* the database
* run the database migrations
* start the web app that can communicate with the database on [http://localhost:5000/ping](http://localhost:5000/ping)

### Using Docker Run

If you want to run just the web image directly from Docker Hub (note: this requires a separate database setup):

```sh
docker run -d -p 127.0.0.1:5000:5000 --name class9-example mkaltenr/example-git:latest
```

Important: When running the container this way, you need to:
1. Make sure the `HOST` environment variable is set to `0.0.0.0` in the container
2. Ensure your database is accessible to the container
3. Database migrations have been run

You can pass environment variables directly to the container:

```sh
docker run -d -p 127.0.0.1:5000:5000 -e HOST=0.0.0.0 -e DATABASE_URL=postgresql://username:password@host:5432/db_name --name class9-example mkaltenr/example-git:latest
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:

1. Tests the application
2. Builds a Docker image
3. Pushes the image to Docker Hub as `mkaltenr/example-git:latest`

The workflow runs automatically on pushes to the main branch and can be found in `.github/workflows/build-test-push.yaml`.

## NPM Scripts

* `npm run build`: will transpile the typescript app to javascript executable by nodejs
* `npm run start`: will start the server found in the `dist` folder
* `npm run migrate`: will start the migrations
* `npm run prisma:generate`: will create the types for the database interactions (create, update, delete, etc, ...)
* `npm run test`: will run Jest tests with coverage report
* `npm run start:dev`: will start the server with nodemon that watches for changes in the code
* `npm run migrate:dev`: will start the migrations in development mode
* `npm run prisma:generate:dev`: will create the types for the database interactions in development mode (create, update, delete, etc, ...)
* `npm run setup:dev`: will prepare and setup your local environment with a single command
* `npm run setdown:dev`: will stop all running development containers
* `npm run cleanup:dev`: will remove and reinstall all node_modules

## Environment Variables

We use `dotenv-cli` to pass the environment variables to a command, like:

```sh
dotenv -e .env -- npx prisma migrate deploy
```

### Adding new Environment Variables

For local development modify the `.env.local`file and for production the `.env` file, like:

```txt
# commments
MY_NEW_VARIABLE="my-new-value"
```

## Add a new Migration

Modify the `prisma.schema` in `app/database/prisma/prisma.schema`, like:

```prisma
model SomeNewModel {
  // add your table fields
}
```

and run `npm run migrate`.
