import React from "react";
import clsx from "clsx";
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { withStyles } from "@material-ui/core/styles";
import {
  Route,
  Switch,
  HashRouter,
  withRouter,
  Redirect,
} from "react-router-dom";

import About from "./About";
import CompanyDetails from "./CompanyDetails";
import Comparision from "./Comparision";
import Login from "./Login";
import NavigationBar from "./NavigationBar";
import PageNotFound from "./PageNotFound";
import Performance from "./Performance";
import Revenue from "./Revenue";
import Sectors from "./Sectors";
import SideBar from "./SideBar";
import SP500 from "./SP500";
import Top from "./Top";
import Simulation from "./Simulation";
import Main from "./Main";
import SignUp from "./SignUp";

const drawerWidth = 300;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: JSON.parse(localStorage.getItem("logged")) || false,
      open: true,
    };
  }

  componentDidMount = () => {
    const logged = JSON.parse(localStorage.getItem("logged"));
    if (logged == null) {
      localStorage.setItem("logged", JSON.stringify(false));
    }
    console.log("Home");
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme } = this.props;
    const open = this.state.open;
    const logged = JSON.parse(localStorage.getItem("logged"));
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar
          position="relative"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
          style={{ backgroundColor: "#15DB95", color: "#0D19A3" }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            <NavigationBar />
          </Toolbar>
        </AppBar>
        <div className={classes.root}>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div
              className={classes.drawerHeader}
              style={{ backgroundColor: "#15DB95", color: "#0D19A3" }}
            >
              <Typography variant="h4">Stock Vestor</Typography>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <SideBar />
          </Drawer>
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/home" component={Main} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/top/:num/:type"
                render={(props) => {
                  if (logged === undefined || logged === false) {
                    return <Redirect to="/login" />;
                  }
                  const {
                    match: {
                      params: { num, type },
                    },
                  } = props;
                  return <Top key={`num=${num}&type=${type}`} {...props} />;
                }}
              />
              <Route
                exact
                path="/sectors"
                render={(props) => {
                  if (logged === undefined || logged === false) {
                    return <Redirect to="/login" />;
                  }
                  return <Sectors />;
                }}
              />
              <Route
                exact
                path="/companydetails/:company"
                render={(props) => {
                  if (logged === undefined || logged === false) {
                    return <Redirect to="/login" />;
                  }
                  const {
                    match: {
                      params: { company },
                    },
                  } = props;
                  return (
                    <CompanyDetails key={`company=${company}`} {...props} />
                  );
                }}
              />
              <Route
                exact
                path="/revenue"
                render={(props) => {
                  if (logged === undefined || logged === false) {
                    return <Redirect to="/login" />;
                  }
                  return <Revenue />;
                }}
              />
              <Route
                exact
                path="/sp500"
                render={(props) => {
                  if (logged === undefined || logged === false) {
                    return <Redirect to="/login" />;
                  }
                  return <SP500 />;
                }}
              />
              <Route
                exact
                path="/comparision"
                render={(props) => {
                  if (logged === undefined || logged === false) {
                    return <Redirect to="/login" />;
                  }
                  return <Comparision />;
                }}
              />
              <Route
                exact
                path="/simulation"
                render={(props) => {
                  if (logged === undefined || logged === false) {
                    return <Redirect to="/login" />;
                  }
                  return <Simulation />;
                }}
              />
              <Route component={PageNotFound} />
            </Switch>
          </main>
        </div>
      </React.Fragment>
    );
  }
}
export default withStyles(styles, { withTheme: true })(withRouter(Home));
