<h1 align="center">
  <br>
  Teleman
  <br>
</h1>

<h4 align="center">Real-Time Dashboard and Control Application for LG Smart TVs</h4>

<p align="center">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white">
    <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
    <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
    <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white">
    <img src="https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white">
</p>
<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#components">Components</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#license">License</a>
</p>

![screenshot](https://pbs.twimg.com/media/Fk58TonXgAE8ooB?format=jpg)

## Key Features

* Adjust audio levels
* Switch between channels
* Access Electronic Program Guide
* Obtain statistics related to viewed channels and channel categories
* Set up automation rules

## Architecture

![Alt text](https://i.imgur.com/4879ZbE.png)

## Components

### Communication Layer

**Communicates directly with the TV.**

**Subscribes to WSS event streams and forwards data over Kafka to the <a href="#service-and-optimization-layer">Service and Optimization Layer components</a>.**

#### Interface

Interface is responsible for direct communication with LG Smart TVs running the WebOS operating system.

The Interface is communicating with the TVs over a WebSocket Secure (WSS) connection, and all requests are directly proxied to the TV.

### Service and Optimization Layer

**Processes data received over Kafka in Real-Time, then caches and forwards them to the <a href="#presentation-layer">Presentation Layer</a> with Server-Sent Events.**

#### Control Service

Control Service is responsible for caching most state information of the TV to Redis and serving all these data to the Presentation Layer when requested.

Also, since the Presentation Layer does not communicate via the interface directly, TV commands are going through the Control Service over to the Interface.

#### Statistics Service

Statistics Service is responsible for dynamic processing of state changes of the TV in order to produce various statistics out of such data (i.e. viewed channels and channel categories, TV uptime, etc.).

#### Meta-Data Service

Meta-Data Service is responsible for providing Channel and Electronic Program Guide meta-data to other services, such as Statistics Service.

#### Automation Service

Automation Service is responsible for managing and scheduling various automation rules (i.e. turning on the TV based on a Cron schedule).

#### EPG Scraping Service (New)

EPG Scraping service is responsible for scraping Electronic Program Guide data from various online data sources.

Since the WebOS API refuses to send the fetched EPG data from the ISP and Teleman's previous data source, iptv-org's EPG repository has been taken down, they have to be scraped with this service.

#### Authentication Service (New)

Authentication Service is responsible for onboarding and authenticating users.

This service is in early-stage, and authentication / authorization features are not complete yet.

### Presentation Layer

**Receives data in Real-Time through Server-Sent Events from the <a href="#service-and-optimization-layer">Service and Optimization Layer</a>, then caches them in Redux stores.**

#### Front-end

A NextJS front-end application with Redux.

Subscribes to Server-Sent Event streams of the <a href="#service-and-optimization-layer">Service and Optimization Layer components</a>, and refreshes data in Real-Time in the Redux stores.

## How To Use

### Pre-requisites

A running instance of the following:

* Apache Kafka
* MongoDB
* PostgreSQL
* Redis

### Configuring and starting Teleman

1. **Configure Kafka, Mongo, PostgreSQL and Redis**
    * In case of `control-service`, `stats-service`, `meta-service`, `automation-service`, copy `application-sample.properties` and rename it to `application.properties`, then provide your configuration
    * In case of `authentication-service`, provide the `POSTGRES_CONNECTION_STRING` environment variable
2. **Configure interface**
    * Copy `environment.sample.ts` and rename it to `environment.ts`, then provide your configuration
3. **Start the applications**
    * In case of `control-service`, `stats-service`, `meta-service`, `automation-service`, execute `gradle bootRun`
    * In case of `authentication-service`, execute `cargo run`
    * In case of `interface` and `frontend`, execute `yarn dev`
4. **Register a user, then log in with it**

## License

AGPL-3.0
