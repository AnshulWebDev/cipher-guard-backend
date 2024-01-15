const express = require("express");
const { createNote } = require("../controllers/note/createNote.js");
const { deleteNote } = require("../controllers/note/deleteNote.js");
const { favoriteNote } = require("../controllers/note/favoriteNote.js");
const { getAllNote } = require("../controllers/note/getAllNote.js");
const { getFavoriteNote } = require("../controllers/note/getFavoriteNote.js");
const { getNote } = require("../controllers/note/getNote.js");
const { searchNote } = require("../controllers/note/searchNote.js");
const { updateNote } = require("../controllers/note/updateNote.js");
const { auth, isAuthUser, verifyAuthPin } = require("../middleware/auth.js");
const router = express.Router();

router.post("/createNote", auth, isAuthUser, verifyAuthPin, createNote);
router.delete("/deleteNote/:id", auth, isAuthUser, verifyAuthPin, deleteNote);
router.put("/favoriteNote/:id", auth, isAuthUser, verifyAuthPin, favoriteNote);
router.get("/getAllNote", auth, isAuthUser, verifyAuthPin, getAllNote);
router.get(
  "/getFavoriteNote",
  auth,
  isAuthUser,
  verifyAuthPin,
  getFavoriteNote
);
router.get("/getNote/:id", auth, isAuthUser, verifyAuthPin, getNote);
router.get("/searchNote", auth, isAuthUser, verifyAuthPin, searchNote);
router.put("/updateNote/:id", auth, isAuthUser, verifyAuthPin, updateNote);

module.exports = router;
