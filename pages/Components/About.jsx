import React from "react";
import { Typography } from "@material-ui/core";

class About extends React.Component {
  componentDidMount = () => {
    console.log("About");
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            padding: "25px",
          }}
        >
          <Typography variant="h4">About</Typography>
        </div>
      </React.Fragment>
    );
  }
}

export default About;
