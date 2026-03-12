const express = require("express");
const router = express.Router();

const rolesAndAccess = require("./rolesAndAccess");
const settings = require("./settings");
const clients = require("./clients");
const services = require("./services");
const payments = require("./payments");

router.get("/", (req, res) => {
  res.render("index", { title: "Dashboard", subTitle: "AI" });
});

router.get("/index", (req, res) => {
  res.render("index", { title: "Dashboard", subTitle: "AI" });
});

router.get("/not-found", (req, res) => {
  res.render("notFound", { title: "404", subTitle: "404" });
});

router.use("/role-and-access", rolesAndAccess);
router.use("/settings", settings);
router.use("/clients", clients);
router.use("/services", services);
router.use("/payments", payments);

module.exports = function (app) {
  app.use("/", router);
};
