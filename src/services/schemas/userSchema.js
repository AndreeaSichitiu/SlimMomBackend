const moongose = require("mongoose");
const bCrypt = require("bcryptjs");
const Schema = moongose.Schema;
 


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  token: {
    type: String,
    default: null,
  },
   verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  infouser: {
    currentWeight: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    age: {
      type: Number,
      default: null
    },
    desiredWeight: {
      type: Number,
      default: null
    },
    bloodType: {
      type: Number,
      default: null
    }, 
    dailyRate: {
      type: Number,
      default: null
    },
    notAllowedProducts: {
      type: [String],
      default: null
    }, 
    notAllowedProductsAll: {
      type: [String],
      default: null
    }, },
});

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};
userSchema.methods.setToken = function (token) {
  this.token = token;
};


const User = moongose.model("users", userSchema);
module.exports = User;
