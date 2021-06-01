import { withStyles } from "@material-ui/core/styles";
import { TextField, Typography, Grid } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import axios from "axios";
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
      backgroundColor: "#c2c2c2",
    },
  },
});

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedCompany: " ", companyNames: [] };
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
    axios
      .get("/api/companynames")
      .then((s) => {
        if (s.status === 200) {
          this.setState({ companyNames: s.data });
        } else {
          this.setState({ companyNames: [] });
        }
      })
      .catch((e) => console.log(e));
  };

  render() {
    const { classes } = this.props;
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
            to="/performance"
            className={classes.link}
            activeStyle={{ color: "blue" }}
          >
            <Typography className={classes.typography} variant="h4">
              Performance
            </Typography>
          </NavLink>
        </Grid>
        <Grid item className={classes.grid}>
          <NavLink
            to="/login"
            className={classes.link}
            activeStyle={{ color: "blue" }}
          >
            <Typography className={classes.typography} variant="h4">
              Login
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
      </Grid>
    );
  }
}
export default withStyles(styles)(withRouter(NavigationBar));
