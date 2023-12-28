const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const sgMail = require("@sendgrid/mail");

const contactsRouter = require("./src/routes/api/contacts");
 
require("./src/middlewares/passportConfig");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api", contactsRouter);

app.use(express.static(path.join(__dirname, "public")));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
