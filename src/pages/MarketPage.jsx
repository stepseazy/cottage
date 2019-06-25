import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
} from "../graphql/subscriptions";
import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
import Product from "../components/Product";
import { formatProductDate } from "../utils";

const getMarket = `query GetMarket($id: ID!) {
  getMarket(id: $id) {
    id
    name
    products(sortDirection: DESC, limit: 999) {
      items {
        id
        description
        market {
          id
          name
          tags
          owner
          createdAt
        }
        file {
          bucket
          region
          key
        }
        price
        shipped
        owner
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner: false,
    isEmailVerified: false
  };

  componentDidMount() {
    this.handleGetMarket();
    this.createdProductListener = API.graphql(
      graphqlOperation(onCreateProduct)
    ).subscribe({
      next: productData => {
        const createdProduct = productData.value.data.onCreateProduct;
        const prevProducts = this.state.market.products.items.filter(
          item => item.id !== createdProduct.id
        );
        const updatedProducts = [createdProduct, ...prevProducts];
        const market = {
          ...this.state.market
        };
        market.products.items = updatedProducts;
        this.setState({
          market
        });
      }
    });
    this.onUpdateProductListener = API.graphql(
      graphqlOperation(onUpdateProduct)
    ).subscribe({
      next: productData => {
        const updatedProduct = productData.value.data.onUpdateProduct;
        const updatedProductIndex = this.state.market.products.items.findIndex(
          item => item.id === updatedProduct.id
        );
        const updatedProducts = [
          ...this.state.market.products.items.slice(0, updatedProductIndex),
          updatedProduct,
          ...this.state.market.products.items.slice(updatedProductIndex + 1)
        ];
        const market = {
          ...this.state.market
        };
        market.products.items = updatedProducts;
        this.setState({
          market
        });
      }
    });
    this.deleteProductListener = API.graphql(
      graphqlOperation(onDeleteProduct)
    ).subscribe({
      next: productData => {
        const deletedProduct = productData.value.data.onDeleteProduct;
        const updatedProducts = this.state.market.products.items.filter(
          item => item.id !== deletedProduct.id
        );
        const market = {
          ...this.state.market
        };
        market.products.items = updatedProducts;
        this.setState({
          market
        });
      }
    });
  }

  componentWillUnmount() {
    this.createdProductListener.unsubscribe();
    this.deleteProductListener.unsubscribe();
    this.onUpdateProductListener.unsubscribe();
  }

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId
    };
    try {
      const result = await API.graphql(graphqlOperation(getMarket, input));
      this.setState(
        {
          market: result.data.getMarket,
          isLoading: false
        },
        () => {
          this.checkMarketOwner();
          this.checkEmailVerified();
        }
      );
    } catch (err) {}
  };

  checkMarketOwner = () => {
    const { user } = this.props;
    const { market } = this.state;
    if (user) {
      this.setState({
        isMarketOwner: user.username === market.owner
      });
    }
  };

  checkEmailVerified = () => {
    const { userAttributes } = this.props;
    if (userAttributes) {
      this.setState({
        isEmailVerified: userAttributes.email_verified
      });
    }
  };
  render() {
    const { market, isLoading, isMarketOwner, isEmailVerified } = this.state;
    return isLoading ? (
      // <Loading fullscreen={true} />
      <h1>loading</h1>
    ) : (
      <h1>to be continued</h1>
    );
  }
}

export default MarketPage;
