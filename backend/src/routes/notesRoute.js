import express from "express";
import { addNoteHandlers, getAllNotesHandler, getNoteByIdHandler } from "../handlers/notesHandler.js";

const noteRouter = express.Router();

noteRouter.get("/notes", getAllNotesHandler);
noteRouter.post("/notes", addNoteHandlers)
noteRouter.get("/notes/:id", getNoteByIdHandler)

export default noteRouter;
