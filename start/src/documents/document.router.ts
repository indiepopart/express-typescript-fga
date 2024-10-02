import express from "express";
import {
  deleteDocumentById,
  findDocumentById,
  getAllDocuments,
  saveDocument,
  updateDocument,
} from "./document.service";

export const documentRouter = express.Router();

documentRouter.get("/", async (req, res, next) => {
  try {
    const documents = await getAllDocuments();
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
});

documentRouter.post("/", async (req, res, next) => {
  try {
    const document = await saveDocument(req.body);
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
});

documentRouter.put("/:id", async (req, res, next) => {
  try {
    const document = await updateDocument(req.params.id, req.body);
    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
});

documentRouter.delete("/:id", async (req, res, next) => {
  try {
    const document = await deleteDocumentById(req.params.id);
    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

documentRouter.get("/:id", async (req, res, next) => {
  try {
    const document = await findDocumentById(req.params.id);
    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
});
