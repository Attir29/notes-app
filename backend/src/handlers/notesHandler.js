import { pool } from "../config/db.js";

export const getAllNotesHandler = async (req, res) => {
  const [notes] = await pool.query("SELECT * FROM notes");

  res.status(200).json({
    status: "succes",
    data: notes,
  });
};

export const addNoteHandlers = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "title is required",
    });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "content is required",
    });
  }

  const [insertResult] = await pool.query(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content]
  );

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [
    insertResult.insertId,
  ]);

  res.status(201).json({
    status: "success",
    message: "Note created",
    data: notes[0],
  });
};

export const getNoteByIdHandler = async (req, res) => {
  const { id } = req.params;

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);

  if (notes.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "note not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: notes[0],
  });
};


export const updateNoteByIdHandler = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const [updateResult] = await pool.query(
    "UPDATE notes SET title=?, content=? WHERE id=?",
    [title, content, id]
  );

  if (updateResult.affectedRows === 0) {
    return res.status(404).json({
      status: "fail",
      message: "note not found",
    });
  }

  const [notes] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
  res.status(200).json({
    status: "success",
    message: "note updated successfully",
    data: notes[0],
  });
};

export const deleteNoteByIdHandler = async (req, res) => {
  const { id } = req.params;

  const [deleteResult] = await pool.query("DELETE FROM notes WHERE id=?", [id]);

  if (deleteResult.affectedRows === 0) {
    return res.status(404).json({
      status: "fail",
      message: "note not found"
    });
  }

  res.status(200).json({
    status: "success",
    message: "Note deleted successfully"
  });
};
