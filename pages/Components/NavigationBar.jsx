import { withStyles } from "@material-ui/core/styles";
import {
  TextField,
  Typography,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import axios from "axios";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  link: {
    textDecoration: "initial",
  },
  typography: {
    padding: 20,
  },
  grid: {
    "&:hover": {
      backgroundColor: "#F4E4C1",
      color: "#E4C580",
    },
  },
  largeIcon: {
    width: 60,
    height: 60,
    fontSize: 25,
  },
});

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompany: " ",
      companyNames: JSON.parse(localStorage.getItem("companyNames")) || [],
      dialogopen: false,
    };
  }

  selectedCompany = (e, val) => {
    const { history } = this.props;
    if (val === null) {
      history.push("/");
      return;
    }
    this.setState({ selectedCompany: val }, () => {
      history.push("/companydetails/" + this.state.selectedCompany);
    });
  };

  componentDidMount = () => {
    console.log("NavigationBar");
    const companyNames = JSON.parse(localStorage.getItem("companyNames"));
    if (companyNames != null) {
      return;
    }

    this.getCompanyNames();
  };

  getCompanyNames = () => {
    axios
      .get("/api/companynames")
      .then((s) => {
        if (s.status === 200) {
          this.setState({ companyNames: s.data }, () => {
            localStorage.setItem(
              "companyNames",
              JSON.stringify(this.state.companyNames)
            );
          });
        } else {
          this.setState({ companyNames: [] });
        }
      })
      .catch((e) => console.log(e));
  };

  render() {
    const { classes, history } = this.props;
    const logged = JSON.parse(localStorage.getItem("logged"));
    return (
      <Grid container className={classes.root} spacing={1}>
        <Grid item className={classes.grid}>
          <NavLink
            to="/home"
            className={classes.link}
            activeStyle={{ color: "blue" }}
          >
            <Typography className={classes.typography} variant="h4">
              Home
            </Typography>
          </NavLink>
        </Grid>

        <Grid item className={classes.grid}>
          <NavLink
            to="/about"
            className={classes.link}
            activeStyle={{ color: "blue" }}
          >
            <Typography className={classes.typography} variant="h4">
              About
            </Typography>
          </NavLink>
        </Grid>
        <Grid item className={classes.grid}>
          <NavLink
            to="/comparision"
            className={classes.link}
            activeStyle={{ color: "blue" }}
          >
            <Typography className={classes.typography} variant="h4">
              Comparision
            </Typography>
          </NavLink>
        </Grid>
        <Grid item className={classes.grid}>
          <NavLink
            to="/simulation"
            className={classes.link}
            activeStyle={{ color: "blue" }}
          >
            <Typography className={classes.typography} variant="h4">
              Simulation
            </Typography>
          </NavLink>
        </Grid>
        <Grid item className={classes.grid}>
          <Autocomplete
            style={{ width: "200px" }}
            // value={this.state.selectedCompany}
            inputValue=""
            onChange={(e, val) => {
              this.selectedCompany(e, val);
            }}
            id="search for companies"
            freeSolo
            options={this.state.companyNames.map((companyname) => companyname)}
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
        {logged == false ? (
          <Grid item className={classes.grid}>
            <NavLink
              to="/login"
              className={classes.link}
              activeStyle={{ color: "blue" }}
            >
              <Typography className={classes.typography} variant="h6">
                Sign In
              </Typography>
            </NavLink>
          </Grid>
        ) : (
          <span />
        )}
        {logged == false ? (
          <Grid item className={classes.grid}>
            <NavLink
              to="/signup"
              className={classes.link}
              activeStyle={{ color: "blue" }}
            >
              <Typography className={classes.typography} variant="h6">
                Sign Up
              </Typography>
            </NavLink>
          </Grid>
        ) : (
          <span />
        )}
        {logged == true ? (
          <Grid item>
            <Button
              variant="outlined"
              style={{ marginTop: "25%" }}
              onClick={() => {
                localStorage.setItem("logged", JSON.stringify(false));
                history.push("/");
              }}
            >
              Log Out
            </Button>
          </Grid>
        ) : (
          <span />
        )}
      </Grid>
    );
  }
}
export default withStyles(styles, { withTheme: true })(
  withRouter(NavigationBar)
);
