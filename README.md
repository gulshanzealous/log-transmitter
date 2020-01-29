This project uses NodeJS and websockets.

Deployed at "https://log-transmitter.herokuapp.com/"

# Objective

To read logs from a file and push them using websocket events to clients

# Setup

Project can be setup in two ways: using docker and without docker

## With docker

- ensure you have docker installed and run the following command

```console
	docker build .
	docker-compose up
```

- after the docker runs, the server will open up on port 8080

## Without docker

- ensure that you have node installed locally with version >= 12
- run the following commands

```console
	yarn
	yarn start:dev
```

- this will open the server at port 8080

# App flow

- the server will emit the logs from the log.txt file to all the websocket clients connected to it.
  uses socket io for websocket connections

- to create some dummy logs, a logSeeder function is called using setInterval which appends new logs
  to the logs file every 3 seconds. The interval can be changed in docker-compose.yml file by injecting
  it as an environment variable.

- A Tailor class is made to watch the logs and send events whenever the logs file is updated.
  It handles the watching and unwatching of the log file.
