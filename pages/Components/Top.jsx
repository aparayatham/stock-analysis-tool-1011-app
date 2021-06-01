import { Paper, Typography, withStyles } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import Loader from "react-loader-spinner";

const styles = (theme) => ({
  paper: {
    display: "flex",
    padding: "15px",
    justifyContent: "center",
    backgroundColor: "inherit",
    "&:hover": {
      backgroundColor: "#c2c2c2",
      color: "red",
    },
  },
  navlink: {
    textDecoration: "none",
  },
});

class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      num: "",
      type: "",
      topCompanies: [],
    };
  }

  componentDidMount = () => {
    console.log("Top");
    const { match } = this.props;
    const { num, type } = match.params;
    this.setState({ num: num, type: type, loading: true }, () => {});

    axios
      .get("/api/top?type=" + type + "&" + "num=" + num)
      .then((s) => {
        if (s.status === 200) {
          let topCompanies = s.data;
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
          <div style={{ backgroundColor: "inherit" }}>
            <Paper elevation={1} className={classes.paper}>
              <Typography variant="h4">
                Top {this.state.num} Companies for{" "}
                {this.state.type === "buy" ? "Investing" : "Trading"}
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

export default withStyles(styles, { withTheme: true })(Top);
