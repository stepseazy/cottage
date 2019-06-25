import React from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";

import { convertCentsToDollars, formatOrderDate } from "../utils";

const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    registered
    orders(sortDirection: DESC) {
      items {
        id
        product {
          id
          description
          price
          shipped
          owner
          createdAt
        }
        shippingAddress {
          city
          country
          address_line1
          address_state
          address_zip
        }
        createdAt
      }
      nextToken
    }
  }
}
`;

class ProfilePage extends React.Component {
  state = {
    email: this.props.userAttributes && this.props.userAttributes.email,
    emailDialog: false,
    verificationCode: "",
    verificationForm: false,
    orders: []
  };

  componentWillMount() {
    if (this.props.userAttributes) {
      this.getUserOrders(this.props.userAttributes.sub);
    }
  }

  getUserOrders = async userId => {
    const input = {
      id: userId
    };
    const result = await API.graphql(graphqlOperation(getUser, input));
    this.setState({
      orders: result.data.getUser.orders.items
    });
  };
  handleUpdateEmail = async () => {
    try {
      const updatedAttributes = {
        email: this.state.email
      };
      const result = await Auth.updateUserAttributes(
        this.props.user,
        updatedAttributes
      );

      if (result === "SUCCESS") {
        this.sendVerifcaitonCode("email");
      }
    } catch (err) {
      console.error(err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error updating attribute"}`
      });
    }
  };

  sendVerifcaitonCode = async attr => {
    await Auth.verifyCurrentUserAttribute(attr);
    this.setState({ verificationForm: true });
    // Message({
    //   type: "info",
    //   customClass: "message",
    //   message: `Verification code sent to ${this.state.email}`
    // });
  };

  handleVerifyEmail = async attr => {
    try {
      const result = await Auth.verifyCurrentUserAttributeSubmit(
        attr,
        this.state.verificationCode
      );
      Notification({
        title: "Success",
        message: "Email succesfully verified",
        type: `{result.toLowerCase()}`
      });
      setTimeout(() => window.location.reload(), 3000);
    } catch (err) {
      console.error(err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error updating email"}`
      });
    }
  };

  handleDeleteProfile = () => {
    // MessageBox.confirm(
    //   "This will permanently delete your account. Continue?",
    //   "Attention!",
    //   {
    //     confirmButtonText: "Delete",
    //     cancelButtonText: "Cancel",
    //     type: "warning"
    //   }
    // )
    // .then(async () => {
    //   try {
    //     await this.props.user.deleteUser();
    //   } catch (err) {
    //     console.log(err);
    //   }
    // })
    // .catch(() => {
    //   Message({
    //     type: "info",
    //     message: "Delete Canceled"
    //   });
    // });
  };

  render() {
    const {
      orders,
      columns,
      emailDialog,
      email,
      verificationCode,
      verificationForm
    } = this.state;
    const { user, userAttributes } = this.props;
    return userAttributes && <h1>ProfilePage</h1>;
  }
}

export default ProfilePage;
