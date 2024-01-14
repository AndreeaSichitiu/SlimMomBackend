const moongose = require("mongoose");
const Schema = moongose.Schema;
 

const productSchema = new Schema({
    categories: [{ type: String }],
    weight: {
        type: Number,
        required: true, 
    },
    title: {
        type: String, 
        required: true,
    },
    calories: {
        type: Number,
        required: true, 
    },
    groupBloodNotAllowed: {
        1: { type: Boolean, required: true },
        2: { type: Boolean, required: true },
        3: { type: Boolean, required: true },
        4: { type: Boolean, required: true },
    },
});

const Product = moongose.model("products", productSchema);

module.exports = Product;