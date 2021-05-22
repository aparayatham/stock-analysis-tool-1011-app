import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Button,
  Chip,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import fileDownload from "js-file-download";
import Loader from "react-loader-spinner";
import underscore from "underscore";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
class Simulation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompany: "",
      companyNames: [],
      days: 1,
      investment: 1,
      startdate: "2017-03-10",
      response: [],
      cols: [],
      loading: false,
      seldays: "",
      simulationtop: [],
      rows: [],
    };
  }

  componentDidMount = () => {
    const SP500 =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011/master/Data/SP500Companies.json";
    axios
      .get(SP500)
      .then((s) => {
        if (s.status === 200) {
          let SP500Companies = Object.keys(underscore.invert(s.data));
          this.setState({ companyNames: SP500Companies }, () => {});
        }
      })
      .catch((e) => {
        console.log(e);
      });
    console.log("Simulation");
  };

  onClickSubmit = () => {
    if (this.state.selectedCompany === "") {
      return;
    }
    const params =
      "company=" +
      this.state.selectedCompany +
      "&" +
      "investment=" +
      this.state.investment +
      "&" +
      "days=" +
      this.state.days +
      "&" +
      "date=" +
      this.state.startdate;
    this.setState({ loading: true });
    axios
      .get("/api/simulation?" + params)
      .then((s) => {
        if (s.status === 200) {
          let resp = s.data;
          if (resp.length != 0) {
            let cols = [];
            Object.keys(resp[0]).map((key) => {
              cols.push({ field: key, headerName: key, width: 150 });
            });
            let rows = [];
            for (let i = 0; i < resp.length; i++) {
              if (Object.keys(resp[i]).length === 0) {
              } else {
                resp[i]["id"] = i;
                rows.push(resp[i]);
              }
            }
            this.setState(
              { response: rows, cols: cols, loading: false },
              () => {}
            );
          } else {
            this.setState({ loading: false }, () => {});
          }
        } else {
          this.setState({ loading: false }, () => {});
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState({ loading: false }, () => {});
      });
  };

  onSelectDays = (e) => {
    const days = e.target.value;
    this.setState({ seldays: days, loading: true }, () => {});
    axios
      .get("/api/simulationtop" + "?" + "days=" + days)
      .then((s) => {
        if (s.status === 200) {
          let response = s.data;
          // for (let i = 0; i < response.length; i++) {
          //   const element = response[i];
          //   var sim = element["simulation"];
          //   sim = sim.replaceAll("False", "false");
          //   sim = sim.replaceAll("True", "true");
          //   sim = eval(JSON.parse(sim));
          //   for (let j = 0; j < sim.length; j++) {
          //     let ele = sim[j];
          //     ele["id"] = j;
          //     sim[j] = ele;
          //   }
          //   response[i]["simulation"] = sim;
          // }
          // let simkeys = Object.keys(response[0]["simulation"][0]);
          // let cols = [];
          // simkeys.slice(0, simkeys.length - 1).map((key) => {
          //   cols.push({ field: key, headerName: key, width: 150 });
          // });
          // this.setState(
          //   { simulationtop: response, cols: cols, loading: false },
          //   () => {}
          // );
          let rows = [];
          // for (let i = 0; i < response.length; i++) {
          //   const element = response[i];
          //   element["id"] = i;
          //   response[i] = element;
          //   rows.push({
          //     id: element["id"],
          //     company: element["company"],
          //     code: element["code"],
          //     average_return_percent: element["average_return_percent"],
          //   });
          // }
          let cols = [];
          // Object.keys(response[0]).map((key) => {
          //   cols.push({ field: key, headerName: key, width: 250 });
          // });
          // cols.pop();

          // const button = {
          //   fieldName: "",
          //   headerName: "Download",
          //   width: 250,
          //   renderCell: (params) => {
          //     return <Button onClick={onClick}>Click</Button>;
          //   },
          // };

          // cols.push(button);
          // console.log(cols);
          this.setState(
            { simulationtop: response, loading: false, rows: rows, cols: cols },
            () => {}
          );
        } else {
          this.setState({ loading: false }, () => {});
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  exportToCSV = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };
  downloadfile = (e) => {
    const simurl =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/SimulationResult/top_seldays.csv";
    const curr = e.currentTarget.value;
    axios
      .get(simurl.replace("top_seldays", curr), {
        responseType: "blob",
      })
      .then((r) => {
        if (r.status === 200) {
          fileDownload(r.data, curr + ".csv");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  render() {
    const today = new Date();
    return (
      <React.Fragment>
        <Grid>
          <FormControl style={{ minWidth: "150px" }} variant="outlined">
            <InputLabel>days</InputLabel>
            <Select
              style={{ width: "100%" }}
              labelId="days"
              id="days"
              onChange={this.onSelectDays}
              value={this.state.seldays}
            >
              {[30, 60, 90, 180, 270, 360, 540, 720, 900, 1080].map(
                (period) => {
                  return <MenuItem value={period}>{period}</MenuItem>;
                }
              )}
            </Select>
          </FormControl>
          {this.state.simulationtop.length === 0 ? (
            <span />
          ) : (
            <div>
              <Grid container style={{ margin: "10px" }}>
                <Grid xs={6}>
                  <Typography variant="h6">{"Company"}</Typography>
                </Grid>
                <Grid xs>
                  <Typography variant="h6">{"Returns"}</Typography>
                </Grid>
                <Grid xs>
                  <Typography variant="h6">{"Simulation Result"}</Typography>
                </Grid>
              </Grid>
              {this.state.simulationtop.map((row) => {
                return (
                  <Grid container style={{ margin: "10px" }}>
                    <Grid xs={6}>
                      <Typography variant="h6">{row["company"]}</Typography>
                    </Grid>
                    <Grid xs>
                      <Typography variant="h6">
                        {row["average_return_percent"]}
                      </Typography>
                    </Grid>
                    <Grid xs>
                      <Button
                        variant="outline"
                        size="large"
                        id={row["code"] + "_" + this.state.seldays}
                        value={row["code"] + "_" + this.state.seldays}
                        onClick={this.downloadfile}
                      >
                        Download
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}
            </div>
            // <DataGrid
            //   rows={this.state.rows}
            //   columns={this.state.cols}
            //   autoHeight
            //   disableSelectionOnClick
            //   hideFooterPagination
            //   hideFooter
            //   onRowClick={this.downloadfile}
            // />
            // <Grid>
            //   <Typography variant="h4"> Companies to invest</Typography>
            //   {this.state.simulationtop.map((row) => {
            //     return (
            //       <DataGrid
            //         rows={row["simulation"]}
            //         columns={this.state.cols}
            //         autoHeight
            //         disableSelectionOnClick
            //         hideFooterPagination
            //         hideFooter
            //         components={{
            //           Toolbar: this.exportToCSV,
            //         }}
            //       />
            //     );
            //     <Accordion style={{ border: "none" }}>
            //       <AccordionSummary
            //         aria-controls="panel1a-content"
            //         id={row["company"]}
            //       >
            //         <Typography variant="h6">
            //           {row["company"]} {row["average_return_percent"]}
            //         </Typography>
            //       </AccordionSummary>
            //       <AccordionDetails>
            //         <DataGrid
            //           rows={row["simulation"]}
            //           columns={this.state.cols}
            //           autoHeight
            //           disableSelectionOnClick
            //           hideFooterPagination
            //           hideFooter
            //           components={{
            //             Toolbar: this.exportToCSV,
            //           }}
            //         />
            //       </AccordionDetails>
            //     </Accordion>;
            //   })}
            // </Grid>
          )}
        </Grid>

        {/* <Grid container spacing={2} style={{ marginTop: "5px" }}>
          <Grid item>
            <Autocomplete
              style={{ width: "200px" }}
              value={this.state.selectedCompany}
              onChange={(e, val) => {
                if (val == null) {
                  this.setState(
                    { response: [], selectedCompany: "" },
                    () => {}
                  );
                } else {
                  this.setState({ selectedCompany: val }, () => {});
                }
              }}
              id="search for companies"
              freeSolo
              options={this.state.companyNames.map(
                (companyname) => companyname
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="search for companies"
                  margin="normal"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item>
            <TextField
              style={{ paddingTop: "15px" }}
              variant="outlined"
              id="date"
              label="start date"
              type="date"
              defaultValue="2017-03-10"
              value={this.state.startdate}
              onChange={(e) => {
                this.setState({ startdate: e.target.value });
              }}
              InputProps={{
                inputProps: { min: "2017-03-10", max: "2021-03-19" },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              type="number"
              style={{ width: "100%", paddingTop: "15px" }}
              inputProps={{ min: "1", max: "800", step: "1" }}
              label="days"
              variant="outlined"
              value={this.state.days}
              onChange={(e) => {
                this.setState({ days: e.target.value });
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              type="number"
              style={{ width: "100%", paddingTop: "15px" }}
              inputProps={{ min: "1", max: "1000000", step: "1" }}
              label="investment"
              variant="outlined"
              value={this.state.investment}
              onChange={(e) => {
                this.setState({ investment: e.target.value });
              }}
            />
          </Grid>
          <Grid item>
            <Button
              style={{ width: "100%", marginTop: "15px" }}
              variant="outlined"
              size="large"
              onClick={this.onClickSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        {this.state.loading ? (
          <Loader />
        ) : (
          this.state.response.length !== 0 && (
            <DataGrid
              rows={this.state.response}
              columns={this.state.cols}
              autoHeight
              disableSelectionOnClick
              hideFooterPagination
              hideFooter
              components={{
                Toolbar: this.exportToCSV,
              }}
            />
          )
        )} */}
      </React.Fragment>
    );
  }
}

export default Simulation;
