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
  paper: {
    display: "flex",
    padding: "15px",
    margin: "15px",
    justifyContent: "center",
  },
  chip: { margin: "5px", backgroundColor: "#ffffff", color: "#5F00E7" },
});

class CompanyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyDetails: JSON.parse(localStorage.getItem("companyDetails")) || [],
      companyCurrentDayStockDetails:
        JSON.parse(localStorage.getItem("companyCurrentDayStockDetails")) || [],
      selectedCompany:
        JSON.parse(localStorage.getItem("selectedCompany")) || "",
      companydetailsloading: false,
      stockdetailsloading: false,
      suggest: JSON.parse(localStorage.getItem("suggest")) || "",
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
      stockdetails: JSON.parse(localStorage.getItem("stockdetails")) || [],
    };
  }

  componentDidMount = () => {
    console.log("CompanyDetails");
    const { match } = this.props;
    const company = match.params.company;
    const prevcompany = JSON.parse(localStorage.getItem("selectedCompany"));

    if (prevcompany === company) {
      return;
    }

    this.setState({ selectedCompany: company }, () => {
      localStorage.setItem(
        "selectedCompany",
        JSON.stringify(this.state.selectedCompany)
      );
      this.getDetails(this.state.selectedCompany);
    });
  };

  getDetails = async (company) => {
    this.getCompanyDetails(company);
    this.getStockDetails(company);
    this.getSuggestion(company);
  };

  getCompanyDetails = async (company) => {
    this.setState({ companydetailsloading: true }, () => {});
    await axios
      .get("/api/companydetails?company=" + company)
      .then((s) => {
        if (s.status === 200) {
          let companyDetails = s.data;

          this.setState(
            { companyDetails: companyDetails, companydetailsloading: false },
            () => {
              localStorage.setItem(
                "companyDetails",
                JSON.stringify(this.state.companyDetails)
              );
            }
          );
        } else {
          this.setState(
            { companyDetails: [], companydetailsloading: false },
            () => {}
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState(
          { companyDetails: [], companydetailsloading: false },
          () => {}
        );
      });
  };

  getStockDetails = async (company) => {
    this.setState({ stockdetailsloading: true }, () => {});
    await axios
      .get("/api/previousdaystockdetails?company=" + company)
      .then((s) => {
        if (s.status === 200) {
          this.setState(
            { stockdetails: s.data, stockdetailsloading: false },
            () => {
              localStorage.setItem(
                "stockdetails",
                JSON.stringify(this.state.stockdetails)
              );
            }
          );
        } else {
          this.setState(
            { stockdetails: [], stockdetailsloading: false },
            () => {}
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState(
          { stockdetails: [], stockdetailsloading: false },
          () => {}
        );
      });
  };

  getSuggestion = async (company) => {
    await axios
      .get("/api/suggest?company=" + company)
      .then((t) => {
        if (t.status === 200) {
          let suggest = t.data;
          this.setState({ suggest: suggest["suggest"] }, () => {
            localStorage.setItem("suggest", JSON.stringify(this.state.suggest));
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.selectedCompany !== "" && (
          <div>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h4">{this.state.selectedCompany}</Typography>
            </Paper>
            <Divider />
            {this.state.companydetailsloading === true ? (
              <Loader />
            ) : (
              <Grid container>
                {Object.keys(this.state.companyDetails).map((key) => {
                  if (this.state.companyDetails[key] === null) {
                    return <span key={key.toString()}></span>;
                  }
                  let res = key + " : " + this.state.companyDetails[key];
                  return (
                    <Chip
                      key={key.toString()}
                      variant="outlined"
                      label={res}
                      className={classes.chip}
                    />
                  );
                })}
                <Chip
                  key={"suggest"}
                  variant="outlined"
                  label={"SUGGEST : " + this.state.suggest.toUpperCase()}
                  style={{
                    backgroundColor: "green",
                    margin: "5px",
                    color: "#ffffff",
                  }}
                />
              </Grid>
            )}
          </div>
        )}
        <Divider />
        <Divider />
        {this.state.stockdetailsloading == true ||
        this.state.stockdetails.length == 0 ? (
          <Loader />
        ) : (
          Object.keys(this.state.stockdetails).map((key) => {
            let res = key + " : " + this.state.stockdetails[key];
            if (
              key.toLowerCase() == "code" ||
              key.toLowerCase() == "company" ||
              key.toLowerCase() == "unix date"
            ) {
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
          })
        )}
        {this.state.selectedCompany !== "" &&
          this.state.stockdetails.length !== 0 && (
            <Dashboard company={this.state.selectedCompany} key="dashboard" />
          )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompanyDetails);
