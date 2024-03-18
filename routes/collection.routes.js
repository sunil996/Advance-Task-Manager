const express = require('express');
const router = express.Router();
const verifyJWT = require("../middlewares/auth.middleware.js");

const { createCollection, getCollections, editCollection, deleteCollection } = require("../controllers/collection.controller.js");

router.use(verifyJWT);

router.route("/").post(createCollection);
router.route("/").get(getCollections);
router.route("/:collectioId").get(editCollection);
router.route("/:collectionId").delete(deleteCollection);

module.exports = router;