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
 
// Products Controller 

const getAllProductsController = async (req, res, next) => {


  try {
    const results = await getAllProducts();

    res.status(200).json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    console.info(error);
    res.status(404).json({
      status: "error",
      code: 404,
    });
  }
};


// User Controllers

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
 
  getAllProductsController,
  createUserController,
  loginUserController,
  logoutUserController,
  getUsersController, 
  verifyEmailController,
};
