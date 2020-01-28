import fs from "fs";
import path from "path";
const logFilePath = path.join(__dirname, "../log.txt");

const sampleLogs = [
  "➜ yarn start:dev",
  "yarn run v1.17.3",
  "$ nodemon",
  "[nodemon] 2.0.2",
  "[nodemon] to restart at any time, enter `rs`",
  "[nodemon] watching dir(s): src/**/*",
  "[nodemon] watching extensions: ts,js",
  "[nodemon] starting `ts-node ./src/index.ts`",
  "Line 2:8:  'logo' is defined but never used  @typescript-eslint/no-unused-vars"
];

export default function logEmitter() {
  try {
    const dataToAppend =
      sampleLogs[Math.floor(Math.random() * sampleLogs.length - 1) + 1];
    fs.appendFile(logFilePath, `${dataToAppend}\n`, err => {
      if (err) throw err;
      console.log("following log is chosen : ", dataToAppend);
    });
  } catch (e) {
    console.log(e);
  }
}