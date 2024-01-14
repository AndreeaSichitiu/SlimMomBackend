const express = require("express");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
const Product = require("../../services/schemas/productSchema")
module.exports = router;
const controller = require("../../controllers/controllers");
 
 
const ctrl = require("../../controllers/dailyRateControllers");
// const { getDailyRateSchema } = require("../../services/schemas/dailyRateSchema");


router.post("/", ctrl.dailyRate);
// router.post("/:userId", auth(getDailyRateSchema), ctrl.dailyRate);


router.get("/products", controller.getAllProductsController);
 
router.get('/products/search', async (req, res) => {
    try {
      const { searchTerm } = req.query;
  
      // Create a regex pattern based on the search term
      const regexPattern = new RegExp(searchTerm, 'i');
  
      // Use Mongoose's find method with the regex pattern
      const products = await Product.find({ title: regexPattern });
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  



// router.get("/", auth, controller.get);

// router.get("/contacts/:contactId", auth, controller.getById);

// router.post("/contacts", auth, controller.add);

// router.delete("/contacts/:contactId", auth, controller.remove);

// router.put("/contacts/:contactId", auth, controller.update);

// router.patch("/contacts/:contactId/favorite", auth, controller.updateStatus);

router.post("/users/register", controller.createUserController);

router.post("/users/login", controller.loginUserController);

router.get("/users/logout", auth, controller.logoutUserController);

router.get("/users/current", auth, controller.getUsersController);

router.get("/users/verify/:verificationToken", controller.verifyEmailController);

module.exports = router;
