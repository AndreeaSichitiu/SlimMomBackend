const moongose = require("mongoose");
const Schema = moongose.Schema;
 

const addproductSchema = new Schema({
  productInfo: [
    {
      productWeight: {
        type: String,
      },
      productCalories: {
        type: String,
      },
      productName: {
        type: String,
        required: [true, "productName is required"],
      },
    },
  ],
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});

const AddProduct  = moongose.model("addproducts", addproductSchema);

module.exports = { AddProduct };