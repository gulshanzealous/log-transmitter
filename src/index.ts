import http from "http";
import express from "express";
import socket from "socket.io";
import fs from "fs";
import path from "path";
import logEmitter from "./logEmitter";
const logFilePath = path.join(__dirname, "../log.txt");

const app: Express.Application = express();
const httpServer = http.createServer(app);
const io = socket(httpServer);

// push logs into file
const emitterHandle = setInterval(() => {
  logEmitter();
}, 1000);

// connect socket
io.on("connection", function(socket) {
  console.log("socket is connected with client");

  socket.on("start", function(data: string) {
    console.log(data);
  });
  socket.emit("start", "message emitted from server");

  watchLogFile(socket);
});

// watch the logs file and push new logs to socket
function watchLogFile(socket: any) {
  try {
    fs.watchFile(logFilePath, (curr, prev) => {
      console.log(`the current mtime is: ${curr.mtime}`);
      console.log(`the previous mtime was: ${prev.mtime}`);
      // console.log(curr);
      // console.log(prev);

      socket.emit("log", "new log pushed");
    });
  } catch (e) {
    console.log(e);
  }
}

// listen to 8080
httpServer.listen(8080, () => {
  console.log("listening on 8080");
});
