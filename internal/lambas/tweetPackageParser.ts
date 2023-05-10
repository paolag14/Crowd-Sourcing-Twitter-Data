import { parse } from "csv-parse";
import fs from "fs";
import { Tweet } from "../interfaces/interfaces";

const tweetParser = async () => {
  const headers = [
    "Tweet Id",
    "Text",
    "Name",
    "Screen Name",
    "UTC",
    "Created At",
    "Favorites",
    "Retweets",
    "Language",
    "Client",
    "Tweet Type",
    "URLs",
    "Hashtags",
    "Mentions",
    "Media Type",
    "Media URLs",
  ];

  return new Promise((resolve, reject) => {
    var records: Tweet[] = [];
    fs.createReadStream("EnergiaRenovable-complete-2022.csv")
      .pipe(
        parse({
          columns: headers,
          delimiter: ",",
        })
      )
      .on("data", (data) => {
        records.push(data);
      })
      .on("error", (err) => {
        console.log(err);
      })
      .on("end", () => {
        resolve(records);
      });
  });
};

export default tweetParser;
