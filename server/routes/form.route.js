const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");

const {
  getTables,
  getDatabase,
  save,
  publish,
  getForm,
} = require("../controllers/cForm.js");

router.post("/getTables", protect, getTables);
router.post("/getDatabase", protect, getDatabase);
router.post("/getForm", getForm);
router.post("/save", save);
router.post("/publish", protect, publish);

module.exports = router;
