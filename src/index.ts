import http from "http";
import express from "express";
import socket from "socket.io";
import fs from "fs";
import path from "path";
import logSeeder from "./logSeeder";
import Tailor from "./Tailor";

const app: Express.Application = express();
const httpServer = http.createServer(app);
const io = socket(httpServer);
const logFilePath = path.join(__dirname, "../log.txt");
const tail = new Tailor(logFilePath);

// push logs into file every 3 seconds
const emitterHandle = setInterval(() => {
  logSeeder();
}, 3000);

// connect socket
io.on("connection", function(socket) {
  console.log("socket is connected with client");

  socket.emit("start", "message emitted from server");

  // start emitting tail on start event
  socket.on("start", function(data: string) {
    console.log(data);
    emitTail(socket);
  });

  // stop emitting logs on stop event
  socket.on("stop", function() {
    stopTail(socket);
  });
});

// use the Tailor class to start watching and push logs to socket
function emitTail(socket: socket.Socket) {
  try {
    tail.watch();
    tail.on("line", data => {
      // console.log("datta : ", data);
      socket.emit("log", data);
    });
    tail.on("error", err => {
      console.log(err);
    });
  } catch (e) {
    console.log(e);
  }
}

// use unwatch method from tailor to stop emitting logs to socket
function stopTail(socket: socket.Socket) {
  try {
    tail.unwatch();
    tail.on("line", data => {
      socket.emit("log", data);
    });
    tail.on("error", err => {
      console.log(err);
    });
  } catch (e) {
    console.log(e);
  }
}

// listen to 8080
httpServer.listen(8080, () => {
  console.log("listening on 8080");
});
