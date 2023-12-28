const {
  getAllProducts,   
  createUser,
  loginUser,
  findUser,
  verifyEmail,
 
} = require("../services/index.js");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const { Product, User } = require('../services/schemas'); 
const { createNotFoundError } = require("../../middlewares");

const getDailyRateController = async (req, res) => {
    const dailyRate = calculateDailyRate(req.body);
    const { notAllowedProducts, notAllowedProductsAll } = await notAllowedProductsObj(req.body.bloodType);
    return res.status(200).json({ dailyRate, notAllowedProducts, notAllowedProductsAll, });
};

const getDailyRateUserController = async (req, res) => {
    const { user } = req;
    const dailyRate = calculateDailyRate(user.infouser);
    const { notAllowedProducts, notAllowedProductsAll } = await notAllowedProductsObj(user.infouser.bloodType);
    user.infouser = {
        ...user.infouser,
        dailyRate,
        notAllowedProducts,
        notAllowedProductsAll,
    };
    await User.findByIdAndUpdate(user._id, user);
    return res.status(200).json({ data: user.infouser });
};

const getAllProductsByQuery = async (req, res, next) => {
  const { query: { title, limit = 10 } } = req;
  const titleFromUrl = decodeURI(title).trim();
  const products = await Product.find({
    $or: [
      { $text: { $search: titleFromUrl } },
    ],
  }).limit(limit);
  if (products.length === 0) {
    const newProducts = await Product.find({
      $or: [
        { 'title.ua': { $regex: titleFromUrl, $options: 'i' } },
      ],
    }).limit(limit);

    if (newProducts.length === 0) {
      return next(createNotFoundError());
    }
    return res.status(200).json({ data: newProducts });
  }
  return res.status(200).json({ data: products });
};


const getNotAllowedProductsObj = require("./getNotAllowedProducts");

const calculateDailyRate = ({ currentWeight, height, age, desiredWeight }) => {
  return Math.floor(
      10 * currentWeight +
      6.25 * height -
      5 * age -
      161 - 10 * (currentWeight - desiredWeight),
  );
};

const getNotAllowedProducts = async bloodType => {
  const blood = [null, false, false, false, false];
  blood[bloodType] = true;
  const products = Product.find({
      groupBloodNotAllowed: { $all: [blood] },
  });
  return products;
};

const notAllowedProductsObj = async bloodType => {
    const notAllowedProductsArray = await getNotAllowedProducts(bloodType);
    const arr = [];
    notAllowedProductsArray.map(({ title }) => arr.push(title.ua));
    let notAllowedProductsAll = [...new Set(arr)];
    let notAllowedProducts = [];
    const message = ['You can eat everything'];
    if (notAllowedProductsAll[0] === undefined) {
        notAllowedProducts = message;
    } else {
        do {
            const index = Math.floor(Math.random() * notAllowedProductsAll.length);
            if (notAllowedProducts.includes(notAllowedProductsAll[index]) || notAllowedProducts.includes('undefined')) {
                break;
            } else {
                notAllowedProducts.push(notAllowedProductsAll[index]);
            }
        } while (notAllowedProducts.length !== 5);
    };
    if (notAllowedProductsAll.length === 0) {
        notAllowedProductsAll = message;
    };
    const result = { notAllowedProductsAll, notAllowedProducts };
    return result;
};

const get = async (req, res, next) => {
  try {
    const results = await getAllProducts();

    res.status(200).json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
  }
};

 

// const add = async (req, res, next) => {
//   try {
//     const { name, email, phone, favorite } = req.body;
//     const result = await createContact({ name, email, phone, favorite });
//     res.status(201).json({
//       status: "Success",
//       code: 200,
//       data: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       code: 400,
//       message: "Missing request fields!",
//       debug: error,
//     });
//   }
// };

// const remove = async (req, res, next) => {
//   const id = req.params.contactId;

//   try {
//     const result = await deleteContact(id);
//     console.log("Contact removed");
//     res.status(200).json({
//       status: "Success",
//       code: 200,
//       data: result,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "error",
//       code: 404,
//       message: "Contact not found!",
//     });
//   }
// };

// const update = async (req, res, next) => {
//   const id = req.params.contactId;
//   const data = req.body;

//   try {
//     const result = await updateContact(id, data);
//     console.log("Contact updated");
//     res.status(201).json({
//       status: "Success",
//       code: 201,
//       data: result,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "error",
//       code: 404,
//       message: "Contact not found!",
//     });
//   }
// };

 
const createUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const result = await createUser({
      email,
      password,
    });
    const payload = { email: result.email };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: result.email,
          token,
        },
      },
    });
  } catch (error) {
    res.status(409).json({
      status: 409,
      error: "Email in use!",
    });
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const payload = { email: email };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    const result = await loginUser({
      email,
      password,
      token,
    });
    result.setToken(token);
    res.status(201).json({
      status: "succes",
      code: 201,
      data: {
        token: token,
        user: {
          email: result.email,
          subscription: result.subscription,
        },
      },
    });
  } catch (error) {
    if (error.message === "Wrong email or password") {
      res.status(401).json({
        status: 401,
        message: "Email or password is wrong",
      });
    }
    res.status(400).json({
      status: 400,
      error: error.message,
    });
  }
};

const logoutUserController = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ status: 401, message: "Not authorized" });
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, secret);

    const user = await findUser(decodedToken);
    user.setToken(null);
    await user.save();
    if (user) {
      res.status(204).json({
        status: "success",
        code: 204,
      });
    } else {
      res.status(404).json({ status: "404", message: "User not found" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, message: "Not authorized" });
  }
};

const getUsersController = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ status: 401, message: "Not authorized" });
    }
    const token = authHeader.split(" ")[1];

    const user = jwt.verify(token, secret);

    const result = await findUser({ email: user.email });

    if (result) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: {
          email: result.email,
          subscription: result.subscription,
        },
      });
    } else {
      res.status(404).json({ status: "404", message: "User not found" });
    }
  } catch (error) {
    if (error.message === "invalid token") {
      res.status(401).json({ status: 401, message: "Not authorized" });
    }
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const verifyEmailController = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    await verifyEmail(verificationToken);

    res.status(200).json({ mesaj: "Email verified with succes", code: 200 });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  calculateDailyRate,
  getNotAllowedProducts,
  getNotAllowedProductsObj,
  get,
  // getById,
  // add,
  // remove,
  // update,
  getDailyRateUserController,
  getAllProductsByQuery,
  getDailyRateController,
  createUserController,
  loginUserController,
  logoutUserController,
  getUsersController,
 
  verifyEmailController,
};
