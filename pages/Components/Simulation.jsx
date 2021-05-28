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
      days: "",
      cols: [],
      loading: false,
      seldays: "",
      simulationtop: [],
      rows: [],
    };
  }

  componentDidMount = () => {
    console.log("Simulation");
  };

  onSelectDays = (e) => {
    const days = e.target.value;
    this.setState({ seldays: days, loading: true }, () => {});
    axios
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
          this.setState(
            { simulationtop: response, rows: rows, cols: cols, loading: false },
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

  render() {
    const today = new Date();
    return (
      <React.Fragment>
        <FormControl style={{ minWidth: "150px" }} variant="outlined">
          <InputLabel>days</InputLabel>
          <Select
            style={{ width: "100%" }}
            labelId="days"
            id="days"
            onChange={this.onSelectDays}
            value={this.state.seldays}
          >
            {[30, 60, 90, 180, 360, 720, 1080].map((period) => {
              return <MenuItem value={period}>{period}</MenuItem>;
            })}
          </Select>
        </FormControl>
        {this.state.rows.length !== 0 && (
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
        )}
      </React.Fragment>
    );
  }
}

export default Simulation;
