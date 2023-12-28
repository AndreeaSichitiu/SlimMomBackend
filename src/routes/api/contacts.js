const express = require("express");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
 
const controller = require("../../controllers/controllers");
 
 

  router.post("/", auth, controller.getDailyRateController);
  router.post("/:userId", auth, controller.getDailyRateUserController);
  router.get("/searchProducts", controller.getAllProductsByQuery);

  
 
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
