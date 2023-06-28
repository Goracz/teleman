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
  <a href="#how-to-use">How To Use</a> •
  <a href="#license">License</a>
</p>

![screenshot](https://pbs.twimg.com/media/Fk58TonXgAE8ooB?format=jpg)

## Primary Functions

* Adjust audio levels
* Switch between channels
* Access Electronic Program Guide
* Obtain statistics related to viewed channels and channel categories
* Set up automation rules

## How To Use

### Pre-requisites

A running instance of the following:

* Apache Kafka
* MongoDB
* PostgreSQL
* Redis

### Configuring and starting Teleman

1. Configure Kafka, Mongo, PostgreSQL and Redis
    * In case of `control-service`, `stats-service`, `meta-service`, `automation-service`, copy `application-sample.properties` and rename it to `application.properties`, then provide your configuration
    * In case of `authentication-service`, provide the `POSTGRES_CONNECTION_STRING` environment variable
2. Configure interface
    * Copy `environment.sample.ts` and rename it to `environment.ts`, then provide your configuration
3. Start the applications
    * In case of `control-service`, `stats-service`, `meta-service`, `automation-service`, execute `gradle bootRun`
    * In case of `authentication-service`, execute `cargo run`
    * In case of `interface` and `frontend`, execute `yarn dev`
4. Register a user, then log in with it

## License

AGPL-3.0
