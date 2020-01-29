import fs from "fs";
import path from "path";
const logFilePath = path.join(__dirname, "../log.txt");

const sampleLogs = [
  "➜ yarn start:dev",
  "yarn run v1.17.3",
  "$ nodemon",
  "[nodemon] 2.0.2",
  "[nodemon] to restart at any time, enter rs",
  "2020-01-29T03:08:56.304098+00:00 app[api]: Deploy c31e0741 by user gulshansharmalive@gmail.com 2020-01-29T03:08:56.304098+00:00 app[api]: Release v7 created by user gulshansharmalive@gmail.com 2020-01-29T03:08:57.470683+00:00 heroku[web.1]: State changed from crashed to starting",
  `2020-01-29T03:08:59.000000+00:00 app[api]: Build succeeded`,
  `2020-01-29T03:09:00.080533+00:00 heroku[web.1]: Starting process with command npm start`,
  `2020-01-29T03:09:02.479552+00:00 app[web.1]:`,
  `2020-01-29T03:09:02.479599+00:00 app[web.1]: > log-transmitter@1.0.0 start /app`,
  `2020-01-29T03:09:02.479601+00:00 app[web.1]: > node build/index.js`,
  `2020-01-29T03:09:02.479602+00:00 app[web.1]:`,
  `2020-01-29T03:09:02.748418+00:00 app[web.1]: listening on 8080`,
  `2020-01-29T03:09:03.882762+00:00 heroku[web.1]: State changed from starting to up`,
  "[nodemon] watching dir(s): src/**/*",
  "[nodemon] watching extensions: ts,js",
  "[nodemon] starting `ts-node ./src/index.ts`",
  "Line 2:8:  'logo' is defined but never used  @typescript-eslint/no-unused-vars"
];

// pick a random log from the object above and append to the log file
export function logSeeder() {
  try {
    const dataToAppend =
      sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
    fs.appendFile(logFilePath, `${dataToAppend}\n`, err => {
      if (err) throw err;
      // console.log("following log is chosen : ", dataToAppend);
    });
  } catch (e) {
    console.log(e);
  }
}

// clear logs file
export function logClearer() {
  try {
    fs.writeFile(logFilePath, "", err => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  } catch (e) {
    console.log(e);
  }
}

// `2020-01-29T03:04:51.926239+00:00 heroku[router]: at=error code=H10 desc=App crashed method=GET path="/favicon.ico" host=log-transmitter.herokuapp.com request_id=07ce4b46-f81c-46b6-a77f-f47ab7e4cd83 fwd="45.118.166.83" dyno= connect= service= status=503 bytes= protocol=https`,
