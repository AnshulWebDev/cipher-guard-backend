import express from "express";
import { createNote } from "../controllers/note/createNote.js";
import { deleteNote } from "../controllers/note/deleteNote.js";
import { favoriteNote } from "../controllers/note/favoriteNote.js";
import { getAllNote } from "../controllers/note/getAllNote.js";
import { getFavoriteNote } from "../controllers/note/getFavoriteNote.js";
import { getNote } from "../controllers/note/getNote.js";
import { searchNote } from "../controllers/note/searchNote.js";
import { updateNote } from "../controllers/note/updateNote.js";
import { auth as Auth, isAuthUser, verifyAuthPin } from "../middleware/auth.js";
const router = express.Router();

router.post("/createNote", Auth, isAuthUser, verifyAuthPin, createNote);
router.delete("/deleteNote/:id", Auth, isAuthUser, verifyAuthPin, deleteNote);
router.put("/favoriteNote/:id", Auth, isAuthUser, verifyAuthPin, favoriteNote);
router.get("/getAllNote", Auth, isAuthUser, verifyAuthPin, getAllNote);
router.get(
  "/getFavoriteNote",
  Auth,
  isAuthUser,
  verifyAuthPin,
  getFavoriteNote
);
router.get("/getNote/:id", Auth, isAuthUser, verifyAuthPin, getNote);
router.get("/searchNote", Auth, isAuthUser, verifyAuthPin, searchNote);
router.put("/updateNote/:id", Auth, isAuthUser, verifyAuthPin, updateNote);

export default router;
