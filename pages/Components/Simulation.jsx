import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import axios from "axios";
import Loader from "react-loader-spinner";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
class Simulation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: JSON.parse(localStorage.getItem("cols")) || [],
      loading: false,
      days: JSON.parse(localStorage.getItem("days")) || "",
      rows: JSON.parse(localStorage.getItem("rows")) || [],
    };
  }

  componentDidMount = () => {
    console.log("Simulation");
  };

  onSelectDays = async (e) => {
    const days = e.target.value;
    this.setState({ days: days }, () => {
      localStorage.setItem("days", JSON.stringify(this.state.days));
    });
    this.setState({ loading: true }, () => {});
    await axios
      .get("/api/simulationtop" + "?" + "days=" + days)
      .then((s) => {
        if (s.status === 200) {
          let response = s.data;
          const rows = response;
          let cols = [];
          Object.keys(rows[0]).map((key) => {
            cols.push({ field: key, headerName: key, width: 150 });
          });

          for (let i = 0; i < cols.length; i++) {
            const element = cols[i];
            if (element["field"] == "company") {
              element["width"] = 300;
              cols[i] = element;
            }
            if (element["field"] == "predicted") {
              cols.splice(i, 1);
            }
          }
          this.setState({ rows: rows, cols: cols, loading: false }, () => {
            localStorage.setItem("rows", JSON.stringify(this.state.rows));
            localStorage.setItem("cols", JSON.stringify(this.state.cols));
          });
        } else {
          this.setState({ rows: [], cols: [], loading: false }, () => {});
        }
      })
      .catch((e) => {
        this.setState({ rows: [], cols: [], loading: false }, () => {});
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

  render() {
    const today = new Date();
    return (
      <React.Fragment>
        <div
          style={{
            padding: "25px",
          }}
        >
          <FormControl style={{ minWidth: "150px" }} variant="outlined">
            <InputLabel>days</InputLabel>
            <Select
              style={{ width: "100%" }}
              labelId="days"
              id="days"
              onChange={this.onSelectDays}
              value={this.state.days}
            >
              {[30, 60, 90, 180, 360, 720, 1080].map((period) => {
                return (
                  <MenuItem key={period.toString()} value={period}>
                    {period}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {this.state.loading ? (
            <Loader />
          ) : (
            this.state.rows != 0 && (
              <DataGrid
                rows={this.state.rows}
                columns={this.state.cols}
                autoHeight
                disableSelectionOnClick
                // hideFooterPagination
                // hideFooter
                components={{
                  Toolbar: this.exportToCSV,
                }}
              />
            )
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Simulation;
