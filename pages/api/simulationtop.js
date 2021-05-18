const axios = require("axios");
export default async (req, res, next) => {
  try {
    // const topurl =
    //   "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011/master/Data/Simulation/top_seldays.csv";
    const topurl =
      "https://raw.githubusercontent.com/saikr789/stock-index-risk/master/Data/Simulation/top_seldays.csv";
    const days = req.query["days"];
    axios
      .get(topurl.replace("seldays", days))
      .then((s) => {
        if (s.status === 200) {
          let response = [];
          let rows = s.data.split("\n");
          const header = rows[0].split(",");
          for (let i = 1; i < rows.length; i++) {
            const data = rows[i].split(",", 2);
            if (data.length == 1) {
              continue;
            }
            const rlen = data[0].length + data[1].length + 2;
            const nlen = rows[i].slice(rlen).length;
            let sim = rows[i].slice(rlen);
            response.push({
              company: data[0],
              average_return_percent: data[1],
              simulation: JSON.stringify(sim.slice(1, nlen - 1)),
            });
          }
          res.send(response);
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
