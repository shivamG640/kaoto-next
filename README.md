<p align=center>
  <a href="https://github.com/KaotoIO/kaoto/blob/main/LICENSE"><img src="https://img.shields.io/github/license/KaotoIO/kaoto?color=blue&style=for-the-badge" alt="License"/></a>
  <a href="https://www.youtube.com/@KaotoIO"><img src="https://img.shields.io/badge/Youtube-Follow-brightgreen?color=red&style=for-the-badge" alt="Youtube"" alt="Follow on Youtube"></a>
  <a href="https://camel.zulipchat.com/#narrow/stream/441302-kaoto"><img src="https://img.shields.io/badge/zulip-join_chat-brightgreen?color=yellow&style=for-the-badge" alt="Zulip"/></a></br>
  <a href="https://kaoto.io"><img src="https://img.shields.io/badge/Kaoto.io-Visit-white?color=indigo&style=for-the-badge" alt="Zulip"/></a></br>
</p>

![Kaoto Logo](packages/ui/src/assets/logo-kaoto.png)

# Kaoto
Kaoto is a visual editor for Apache Camel integrations. It offers support in creating and editing Camel Routes, Kamelets and Pipes. Kaoto also has a built-in catalog with available Camel components, Enterprise Integration Patterns and Kamelets provided by the Apache Camel community.

Have a quick look at our online demo instance:
https://kaotoio.github.io/kaoto/

## Table of Contents
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
- [Running kaoto with Docker](#running-kaoto-with-docker)
- [Development](#development)
  - [Web Application](#web-application)
    - [Run](#run)
    - [Build](#build)
  - [Public Components](#public-components)
- [How to do a release](/RELEASE.md)
- [Camel Catalog and Supporting Schemas](#camel-catalog-and-supporting-schemas)
- [Storybook](#storybook)

## Requirements
- NodeJS (v18.x or higher) [+info](https://nodejs.org/en)
- Yarn (v3.x or higher) [+info](https://yarnpkg.com/getting-started/install)
- OpenJDK (v21 or higher) [+info](https://developers.redhat.com/products/openjdk/download)

_For more information on Vite, check [Vite's documentation](https://vitejs.dev/config/)._

## Getting Started
### Clone the Repository
First, clone the repository to your local machine.

```sh
git clone https://github.com/KaotoIO/kaoto
```
### Install Dependencies

Navigate to the cloned directory and install the necessary packages.

```sh
cd kaoto
yarn install
```
_Note: By default, `@kaoto/camel-catalog` will also be built using the `mvn` wrapper._

## Running kaoto with Docker
For trial purposes, there is a docker image that can be run locally:

```sh
docker run --rm -p 8080:8080 --name kaoto quay.io/kaotoio/kaoto-app:main
```

## Development
### Web Application
#### Run
To start the development server, execute the following command:
```sh
yarn workspace @kaoto/kaoto run start
```
The application will be accessible at `http://localhost:5173` by default.

#### Build
To build the web application, execute:
```sh
yarn workspace @kaoto/kaoto run build
```

### Public Components
To build the public components, execute:
```sh
yarn workspace @kaoto/kaoto run build:lib
```

## Camel Catalog and Supporting Schemas
To build the Camel Catalog and the supporting schemas, run:
```sh
yarn workspace @kaoto/camel-catalog run build
```
_Optional: You can update the Camel version in the `pom.xml` file and then run the build command again._

## Storybook

To view the storybook stories, go to [Chromatic](https://main--64ef22df8bb709ffa98c7a47.chromatic.com/). The stories are built for non-Dependabot pull requests and the link to storybook generated for PR is linked once the storybook is published. You can learn more about how to create a story for your UI component [here](https://storybook.js.org/docs/react/writing-stories/introduction).

To run Storybook locally:
``` bash
# first build the ui library
yarn workspace @kaoto/kaoto build:lib

# run the storybook
yarn workspace @kaoto/kaoto-tests storybook
```
To publish to Chromatic: `yarn workspace @kaoto/kaoto-tests chromatic`
