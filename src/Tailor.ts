import events from "events";
import fs from "fs";

interface IQueueLimit {
  start: number;
  end: number;
}

// Tailor class emits "line" and "error" events
// when a new log is added to the log file
// and an error is generated respectively
// It uses the fs.watchFile and fs.createReadStream
// to watch the log file and read updates in it.
class Tailor extends events.EventEmitter {
  filePath: string;
  queue: Array<IQueueLimit>;
  isWatching: boolean;
  encoding: string;
  lastFileSize: number;

  constructor(filePath: string) {
    super();

    this.filePath = filePath;
    this.queue = [];
    this.isWatching = false;
    this.encoding = "utf8";
    this.lastFileSize = 0;

    // start watching the file for changes
    this.watch();
  }

  // watch and compare the previous state of the watched file
  // if the size has changed and the modified timestamps are different,
  // call the readfile method below after pushing the current state of file to queue
  watch = () => {
    try {
      if (this.isWatching) {
        return;
      }
      this.isWatching = true;
      fs.watchFile(this.filePath, (curr, prev) => {
        if (
          curr.mtime !== prev.mtime &&
          curr.size > prev.size &&
          this.lastFileSize !== curr.size
        ) {
          this.queue.push({ start: prev.size, end: curr.size });
          this.lastFileSize = curr.size;
          this._readFile();
        }
      });
    } catch (e) {
      console.log(e);
      this.emit("error", e);
    }
  };

  // reset state
  unwatch = () => {
    try {
      if (!this.isWatching) {
        return;
      }
      this.isWatching = false;
      this.queue = [];
      this.lastFileSize = 0;
      fs.unwatchFile(this.filePath);
      this.emit("line", "stopped watching logs");
    } catch (e) {
      console.log(e);
      this.emit("error", e);
    }
  };

  // use writestream to read new data entered into the file
  // get start and end point of reading from the queue
  // remove oldest elements from queue after the chunk is read
  _readFile = () => {
    try {
      // console.log(this.queue);
      if (this.queue.length > 0) {
        const { start, end }: IQueueLimit = this.queue[0];
        const rr = fs.createReadStream(this.filePath, {
          start: start,
          end: end - 1,
          encoding: this.encoding
        });

        rr.on("data", data => {
          console.log(`NEW LOG : ${data}`);
          this.emit("line", data);
        });
        rr.on("end", () => {
          // console.log("chunk ends");
          this.queue.shift();
        });
        rr.on("error", () => {
          console.log("error here");
          this.emit("error", "can't read file");
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default Tailor;
