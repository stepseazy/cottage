import React from "react";

import { API, graphqlOperation } from "aws-amplify";

import { S3Image } from "aws-amplify-react";

import { updateProduct, deleteProduct } from "../graphql/mutations";

import { convertCentsToDollars, convertDollarsToCents } from "../utils/index";

import { UserContext } from "../App";

import PayButton from "./PayButton";

import { Link } from "react-router-dom";

class Product extends React.Component {
  state = {
    description: "",
    price: "",
    shipped: false,
    updateProductDialog: false,
    deleteProductDialog: false
  };

  handleUpdateProduct = async productId => {
    try {
      this.setState({ updateProductDialog: false });
      const { description, price, shipped } = this.state;
      const input = {
        id: productId,
        description,
        shipped,
        price: convertDollarsToCents(price)
      };
      const result = await API.graphql(
        graphqlOperation(updateProduct, {
          input
        })
      );
      console.log(result);
      Notification({
        title: "Success",
        message: "Product succesfully updated!",
        type: "success",
        duration: 2000
      });
    } catch (err) {
      console.error(`Failed to update product with id:${productId}`, err);
    }
  };

  handleDeleteProduct = async productId => {
    try {
      this.setState({ deleteProductDialog: false });
      const input = {
        id: productId
      };
      const result = await API.graphql(
        graphqlOperation(deleteProduct, { input })
      );
      Notification({
        title: "Success",
        message: "Product succesfully deleted!",
        type: "success",
        duration: 2000
      });
    } catch (err) {
      console.error(`Failed to delete product with id ${productId}`, err);
    }
  };

  render() {
    const { product } = this.props;
    const {
      updateProductDialog,
      description,
      shipped,
      price,
      deleteProductDialog
    } = this.state;
    return (
      <UserContext.Consumer>
        {({ userAttributes }) => {
          const isProductOwner =
            userAttributes && userAttributes.sub === product.owner;

          const isEmailVerified =
            userAttributes && userAttributes.email_verified;
          return <h1>Product</h1>;
        }}
      </UserContext.Consumer>
    );
  }
}

export default Product;
