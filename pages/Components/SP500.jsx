import React from "react";
import { Paper, Typography, withStyles } from "@material-ui/core";

import Dashboard from "./Dashboard";

const styles = (theme) => ({
  paper: {
    display: "flex",
    padding: "15px",
    margin: "15px",
    justifyContent: "center",
    backgroundColor: "inherit",
  },
});
class SP500 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sp500: [] };
  }
  componentDidMount = () => {
    console.log("SP500");
  };
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Paper elevation={0} className={classes.paper}>
          <Typography variant="h4">{"SP 500"}</Typography>
        </Paper>
        <Dashboard company="sp500" />
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SP500);
