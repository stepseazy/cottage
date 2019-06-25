import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createMarket } from "../graphql/mutations";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import SuccessSnackbar from "./SuccessSnackbar";
import ErrorSnackbar from "./ErrorSnackbar";

// prettier-ignore

import { UserContext } from "../App";

const useStyles = makeStyles(theme => ({
  marketTitle: {
    paddingLeft: theme.spacing(1),
    fontSize: "2rem",
    margin: "0",
    "@media (min-width:600px)": {
      fontSize: "3rem"
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "4rem"
    }
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  titleBox: {
    display: "flex",
    flexWrap: "wrap"
  },
  root: {
    padding: theme.spacing(3, 2)
  },
  editButton: {
    margin: theme.spacing(0)
  },
  headerBox: {
    padding: theme.spacing(3)
  },
  fab: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  textField: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
}));

const tags = [
  "Bread",
  "Pastries",
  "Cookies",
  "Fruit Pie",
  "Candie",
  "Nut Butter",
  "Candy",
  "Dried Fruit",
  "Coffee",
  "Tea",
  "Vinegar",
  "Mustard",
  "Granola",
  "Dried Pasta",
  "Jam",
  "Popcorn",
  "Confections",
  "Soup mixes"
];

function getStyles(tag, selectedTag, theme) {
  return {
    fontWeight:
      selectedTag.indexOf(tag) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function NewMarket() {
  const [name, setName] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState([]);
  const [marketDialog, setMarketDialog] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("Success!");
  const [successSnackbarOpen, setSuccessSnackBarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("Success!");
  const [errorSnackbarOpen, setErrorSnackBarOpen] = React.useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const handleAddMarket = async user => {
    try {
      setMarketDialog(false);
      const input = {
        name: name,
        tags: selectedTag,
        owner: user.username
      };
      const result = await API.graphql(
        graphqlOperation(createMarket, {
          input
        })
      );
      console.log({
        result
      });
      setSuccessMessage(
        `Successfully Added Market ${result.data.createMarket.id}`
      );
      setSuccessSnackBarOpen(true);
      console.info(`Created Market: id ${result.data.createMarket.id}`);
      setName("");
      setSelectedTag([]);
    } catch (err) {
      console.error("Error adding new market", err);
      setErrorMessage(`Failed to Added Market`);
      setErrorSnackBarOpen(true);
    }
  };

  return (
    <UserContext.Consumer>
      {({ user }) => (
        <>
          <Box className={classes.headerBox}>
            <Box
              justifyContent="center"
              alignItems="bottom"
              className={classes.titleBox}
              noValidate
              autoComplete="off"
            >
              <Typography
                align="center"
                variant="h3"
                component="h2"
                className={classes.marketTitle}
              >
                Create Market
              </Typography>
              <Button
                aria-label="Edit"
                className={classes.editButton}
                onClick={() => setMarketDialog(true)}
              >
                <EditIcon color="secondary" fontSize="large" />
              </Button>
            </Box>
            <Box
              justifyContent="center"
              alignItems="bottom"
              className={classes.container}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="standard-name"
                label="Search Markets"
                className={classes.textField}
                value={searchTerm}
                onChange={event => {
                  setSearchTerm(event.target.value);
                }}
              />
              <Button
                variant="contained"
                aria-label="Search"
                color="primary"
                className={classes.fab}
              >
                <SearchIcon className={classes.extendedIcon} />
                Search
              </Button>
            </Box>
          </Box>
          <Dialog
            open={marketDialog}
            onClose={() => setMarketDialog(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Create New Market</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You may create up to five markets. You can then add products to
                the market.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Market Name"
                type="text"
                fullWidth
                onChange={event => setName(event.target.value)}
              />
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-chip">Tags</InputLabel>
                <Select
                  multiple
                  value={selectedTag}
                  onChange={event => setSelectedTag(event.target.value)}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(value => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {tags.map(tag => (
                    <MenuItem
                      key={tag}
                      value={tag}
                      style={getStyles(tag, selectedTag, theme)}
                    >
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMarketDialog(false)} color="primary">
                Cancel
              </Button>
              <Button
                disabled={!name}
                onClick={() => handleAddMarket(user)}
                color="primary"
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
          <SuccessSnackbar
            setOpen={setSuccessSnackBarOpen}
            open={successSnackbarOpen}
            type={"success"}
            message={successMessage}
          />
          <ErrorSnackbar
            setOpen={setErrorSnackBarOpen}
            open={errorSnackbarOpen}
            type={"success"}
            message={errorMessage}
          />
        </>
      )}
    </UserContext.Consumer>
  );
}

export default NewMarket;
