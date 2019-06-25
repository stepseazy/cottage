import React from "react";
import { graphqlOperation } from "aws-amplify";
import { makeStyles } from "@material-ui/core/styles";

import { Connect } from "aws-amplify-react";
import { listMarkets } from "../graphql/queries";
import { onCreateMarket } from "../graphql/subscriptions";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import StoreIcon from "@material-ui/icons/Store";

import Error from "./Error";

const useStyles = makeStyles(theme => ({
  marketTitle: {
    textAlign: "left",
    fontSize: "1.5rem",
    margin: "0",
    "@media (min-width:600px)": {
      fontSize: "2rem"
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "3rem"
    }
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const MarketList = ({ searchResults }) => {
  const classes = useStyles();
  const onNewMarket = (prevQuery, newData) => {
    let updatedQuery = { ...prevQuery };
    const updatedMarketList = [
      newData.onCreateMarket,
      ...prevQuery.listMarkets.items
    ];
    updatedQuery.listMarkets.items = updatedMarketList;
    return updatedQuery;
  };
  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}
    >
      {({ data, loading, errors }) => {
        if (errors.length > 0) return <Error />;
        if (loading || !data.listMarkets) return <h1>loading</h1>;

        const markets =
          searchResults.length > 0 ? searchResults : data.listMarkets.items;
        return (
          <>
            <Typography
              align="center"
              variant="h4"
              component="h2"
              className={classes.marketTitle}
            >
              <Button aria-label="Edit" className={classes.fab}>
                <StoreIcon color="secondary" fontSize="large" />
              </Button>
              markets
            </Typography>
          </>
        );
      }}
    </Connect>
  );
};

export default MarketList;
