const express = require("express");
const { createNote } = require("../controllers/note/createNote.js");
const { deleteNote } = require("../controllers/note/deleteNote.js");
const { favoriteNote } = require("../controllers/note/favoriteNote.js");
const { getAllNote } = require("../controllers/note/getAllNote.js");
const { getFavoriteNote } = require("../controllers/note/getFavoriteNote.js");
const { decodeNote } = require("../controllers/note/decodeNote.js");
const { searchNote } = require("../controllers/note/searchNote.js");
const { updateNote } = require("../controllers/note/updateNote.js");
const { auth, isAuthUser, verifyAuthPin } = require("../middleware/auth.js");
const router = express.Router();

router.post("/createNote", auth, isAuthUser, verifyAuthPin, createNote);
router.post("/deleteNote/:id", auth, isAuthUser, verifyAuthPin, deleteNote);
router.put("/favoriteNote/:id", auth, isAuthUser, verifyAuthPin, favoriteNote);
router.post("/getAllNote", auth, isAuthUser, verifyAuthPin, getAllNote);
router.post(
  "/getFavoriteNote",
  auth,
  isAuthUser,
  verifyAuthPin,
  getFavoriteNote
);
router.post("/decodeNote/:id", auth, isAuthUser, verifyAuthPin, decodeNote);
router.post("/searchNote", auth, isAuthUser, verifyAuthPin, searchNote);
router.put("/updateNote/:id", auth, isAuthUser, verifyAuthPin, updateNote);

module.exports = router;
