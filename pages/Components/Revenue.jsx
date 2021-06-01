import { Paper, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Loader from "react-loader-spinner";

const styles = (theme) => ({
  paper: {
    display: "flex",
    padding: "15px",
    justifyContent: "center",
    backgroundColor: "inherit",
    "&:hover": {
      backgroundColor: "#15DB95",
      color: "#0D19A3",
    },
  },
  navlink: {
    textDecoration: "none",
  },
});

class Revenue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topCompanies: [],
      num: 30,
      loading: true,
    };
  }

  componentDidMount = () => {
    console.log("Revenue");
    axios
      .get("/api/previousdaystockdetails")
      .then((s) => {
        if (s.status === 200) {
          let companyStockDetails = s.data;
          companyStockDetails.sort((a, b) => {
            return a["Revenue"] - b["Revenue"];
          });
          companyStockDetails = companyStockDetails.slice(0, this.state.num);
          let topCompanies = [];
          for (let index = 0; index < companyStockDetails.length; index++) {
            const element = companyStockDetails[index];
            topCompanies.push(element["Company"]);
          }
          this.setState(
            { topCompanies: topCompanies, loading: false },
            () => {}
          );
        } else {
          this.setState({ topCompanies: [], loading: false }, () => {});
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState({ topCompanies: [], loading: false }, () => {});
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Loader />
        ) : (
          <div>
            <Paper elevation={0} className={classes.paper}>
              <Typography variant="h4">
                Top {this.state.num} Companies Revenue wise
              </Typography>
            </Paper>
            {this.state.topCompanies.map((company) => {
              return (
                <NavLink
                  className={classes.navlink}
                  key={company.toString()}
                  to={{
                    pathname: "/companydetails/" + company,
                  }}
                >
                  <Paper elevation={0} className={classes.paper}>
                    <Typography variant="h6">{company}</Typography>
                  </Paper>
                </NavLink>
              );
            })}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Revenue);
