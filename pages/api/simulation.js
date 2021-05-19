const fs = require("fs");
const axios = require("axios");
const csv = require("fast-csv");
const moment = require("moment");
const underscore = require("underscore");
export default async (req, res, next) => {
  try {
    const companywithidURL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/SP500Companies.json";
    let simulationURL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/Simulation/secid.csv";
    const date = moment(req.query["date"], "YYYY-MM-DD").unix();
    const days = parseInt(req.query["days"]);
    const investment = parseFloat(req.query["investment"]);
    const company = req.query["company"].toUpperCase();
    axios
      .get(companywithidURL)
      .then(async (s) => {
        if (s.status === 200) {
          const resp = underscore.invert(s.data);
          const secid = resp[company];
          await computeFromURL(
            simulationURL.replace("secid", secid),
            date,
            days,
            investment
          )
            .then((s) => {
              res.send(s);
            })
            .catch((e) => {
              res.status(404).send({ error: "error" });
              console.log(e);
            });
        } else {
          res.status(404).send({ error: "error" });
        }
      })
      .catch((e) => {
        res.status(404).send({ error: "error" });
        console.log(e);
      });
  } catch (error) {
    res.status(404).send({ error: "error" });
  }
};

const computeFromURL = async (simulationURL, date, days, investment) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(simulationURL)
        .then((s) => {
          if (s.status == 200) {
            let response = [];
            let start = false;
            let num = 0;
            let invested = false;
            let shares = 0;
            let rows = s.data.split("\n");
            const header = rows[0].split(",");
            const investindex = header.indexOf("invest");
            const exitindex = header.indexOf("exit");
            const dateindex = header.indexOf("date");
            const closeindex = header.indexOf("close");
            for (let i = 1; i < rows.length; i++) {
              const data = rows[i].split(",");
              const cur = moment(data[dateindex], "YYYY-MM-DD").unix();
              if (cur >= date) {
                start = true;
              }
              if (start) {
                num = num + 1;
                if (data[investindex] === "True") {
                  if (invested == false) {
                    if (investment < parseFloat(data[closeindex])) {
                      response.push({
                        // investment: "not enough",
                      });
                    } else {
                      shares = Math.floor(
                        investment / parseFloat(data[closeindex])
                      );
                      invested = true;
                      response.push({
                        investment: investment.toFixed(3),
                        invest: true,
                        exit: false,
                        date: data[dateindex],
                        shares: shares,
                        close: parseFloat(data[closeindex]),
                      });
                      investment =
                        investment - parseFloat(data[closeindex]) * shares;
                    }
                  }
                }
                if (data[exitindex] === "True") {
                  if (invested) {
                    investment =
                      investment + parseFloat(data[closeindex]) * shares;
                    response.push({
                      investment: investment.toFixed(3),
                      invest: false,
                      exit: true,
                      date: data[dateindex],
                      shares: shares,
                      close: parseFloat(data[closeindex]),
                    });
                    invested = false;
                  }
                }
                if (num == days) {
                  if (invested) {
                    investment =
                      investment + parseFloat(data[closeindex]) * shares;
                    invested = false;
                    response.push({
                      investment: investment.toFixed(3),
                      invest: false,
                      exit: true,
                      date: data[dateindex],
                      shares: shares,
                      close: parseFloat(data[closeindex]),
                    });
                  }
                  break;
                }
                if (i == rows.length - 2) {
                  if (invested) {
                    investment =
                      investment + parseFloat(data[closeindex]) * shares;
                    response.push({
                      investment: investment.toFixed(3),
                      invest: false,
                      exit: true,
                      date: data[dateindex],
                      shares: shares,
                      close: parseFloat(data[closeindex]),
                    });
                    invested = false;
                  }
                }
              }
            }
            resolve(response);
          } else {
            reject({});
          }
        })
        .catch((e) => {
          console.log(e);
          reject({});
        });
    } catch (error) {
      console.log(error);
      reject({});
    }
  });
};
