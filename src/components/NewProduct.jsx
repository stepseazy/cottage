import React from "react";
import { Storage, Auth, API, graphqlOperation } from "aws-amplify";
import { createProduct } from "../graphql/mutations";
import { PhotoPicker } from "aws-amplify-react";
import aws_exports from "../aws-exports";
import { convertDollarsToCents } from "../utils/index";

const initialState = {
  description: "",
  price: "",
  shipped: false,
  imagePreview: "",
  image: "",
  isUploading: false,
  percentUploaded: 0
};

class NewProduct extends React.Component {
  state = { ...initialState };

  handleAddProduct = async () => {
    try {
      this.setState({ isUploading: true });
      const visibility = "public";
      const { identityId } = await Auth.currentCredentials();
      const filename = `/${visibility}/${identityId}/${Date.now()}-
  ${this.state.image.name}`;

      const uploadedFile = await Storage.put(filename, this.state.image.file, {
        contentType: this.state.image.type,
        progressCallback: progress => {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          const percentUploaded = Math.round(
            (progress.loaded / progress.total) * 100
          );
          this.setState({ percentUploaded });
        }
      });
      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_project_region
      };
      const input = {
        productMarketId: this.props.marketId,
        description: this.state.description,
        shipped: this.state.shipped,
        price: convertDollarsToCents(this.state.price),
        file
      };
      const result = await API.graphql(
        graphqlOperation(createProduct, { input })
      );
      console.log("created product", result);
      Notification({
        title: "success",
        message: "Product succesfully created!",
        type: "success"
      });
      this.setState({ ...initialState });
    } catch (err) {
      console.error("error adding product");
    }
  };

  render() {
    const {
      description,
      price,
      image,
      shipped,
      imagePreview,
      isUploading,
      percentUploaded
    } = this.state;
    return <h1>New Product</h1>;
  }
}
export default NewProduct;
