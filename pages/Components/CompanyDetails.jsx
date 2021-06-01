import {
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import axios from "axios";
import Loader from "react-loader-spinner";

import Dashboard from "./Dashboard";

const styles = (theme) => ({
  papercompany: {
    display: "flex",
    padding: "15px",
    margin: "15px",
    justifyContent: "center",
    color: "grey",
  },
  chip: { margin: "5px", backgroundColor: "#ffffff", color: "#5F00E7" },
});

class CompanyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyDetails: [],
      companyCurrentDayStockDetails: [],
      selectedCompany: "",
      loading: true,
      stockkeys: [
        "Date",
        "Open Price",
        "High Price",
        "Low Price",
        "Close Price",
        "WAP",
        "No.of Shares",
        "No. of Trades",
        "Total Turnover (Rs.)",
        "% Deli. Qty to Traded Qty",
        "Spread High-Low",
        "Spread Close-Open",
        "suggest",
      ],
      stockdetails: [],
    };
  }

  componentDidMount = () => {
    console.log("CompanyDetails");
    const { match } = this.props;
    const company = match.params.company;
    this.setState({ selectedCompany: company }, () => {
      this.getCompanyDetails(this.state.selectedCompany);
    });
  };

  getCompanyDetails = async (company) => {
    await axios
      .get("/api/companydetails?company=" + company)
      .then((s) => {
        if (s.status === 200) {
          let companyDetails = s.data;
          axios
            .get("/api/suggest?company=" + company)
            .then((t) => {
              if (t.status === 200) {
                companyDetails = Object.assign(companyDetails, t.data);
              }
            })
            .catch((e) => {
              console.log(e);
            });
          this.setState(
            { companyDetails: companyDetails, loading: false },
            () => {}
          );
        } else {
          this.setState({ companyDetails: [], loading: false }, () => {});
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState({ companyDetails: [], loading: false }, () => {});
      });

    this.setState({ loading: true }, () => {});
    await axios
      .get("/api/previousdaystockdetails?company=" + company)
      .then((s) => {
        if (s.status === 200) {
          this.setState({ stockdetails: s.data, loading: false }, () => {});
        } else {
          this.setState({ stockdetails: [], loading: false }, () => {});
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState({ stockdetails: [], loading: false }, () => {});
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.selectedCompany !== "" && (
          <div>
            <Paper elevation={3} className={classes.papercompany}>
              <Typography variant="h4">{this.state.selectedCompany}</Typography>
            </Paper>
            <Divider />
            {this.state.loading === true ? (
              <Loader />
            ) : (
              <Grid container>
                {Object.keys(this.state.companyDetails).map((key) => {
                  if (this.state.companyDetails[key] === null) {
                    return <span key={key.toString()}></span>;
                  }
                  let res = key + " : " + this.state.companyDetails[key];

                  if (key == "suggest") {
                    return (
                      <Chip
                        key={key.toString()}
                        variant="outlined"
                        label={res.toUpperCase()}
                        style={{
                          backgroundColor: "red",
                          margin: "5px",
                          color: "#ffffff",
                        }}
                      />
                    );
                  }
                  return (
                    <Chip
                      key={key.toString()}
                      variant="outlined"
                      label={res}
                      className={classes.chip}
                    />
                  );
                })}
              </Grid>
            )}
          </div>
        )}
        <Divider />
        <Divider />
        {this.state.stockdetails.length !== 0 &&
          Object.keys(this.state.stockdetails).map((key) => {
            let res = key + " : " + this.state.stockdetails[key];
            if (key.toLowerCase() == "code" || key.toLowerCase() == "company") {
              return;
            }
            return (
              <Chip
                key={key.toString()}
                variant="outlined"
                label={res}
                className={classes.chip}
              />
            );
          })}
        {this.state.selectedCompany !== "" &&
          this.state.stockdetails.length !== 0 && (
            <Dashboard company={this.state.selectedCompany} key="dashboard" />
          )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompanyDetails);
