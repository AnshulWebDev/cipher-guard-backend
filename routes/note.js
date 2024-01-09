import express from "express";
import { createNote } from "../controllers/note/createNote.js";
import { deleteNote } from "../controllers/note/deleteNote.js";
import { favoriteNote } from "../controllers/note/favoriteNote.js";
import { getAllNote } from "../controllers/note/getAllNote.js";
import { getFavoriteNote } from "../controllers/note/getFavoriteNote.js";
import { getNote } from "../controllers/note/getNote.js";
import { searchNote } from "../controllers/note/searchNote.js";
import { updateNote } from "../controllers/note/updateNote.js";
import { auth as Auth, isAuthUser } from "../middleware/auth.js";
const router = express.Router();

router.post("/createNote", Auth, isAuthUser, createNote);
router.delete("/deleteNote/:id", Auth, isAuthUser, deleteNote);
router.put("/favoriteNote/:id", Auth, isAuthUser, favoriteNote);
router.get("/getAllNote", Auth, isAuthUser, getAllNote);
router.get("/getFavoriteNote", Auth, isAuthUser, getFavoriteNote);
router.post("/getNote/:id", Auth, isAuthUser, getNote);
router.get("/searchNote", Auth, isAuthUser, searchNote);
router.post("/updateNote", Auth, isAuthUser, updateNote);

export default router;
