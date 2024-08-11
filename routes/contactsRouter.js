import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = contactsControllers;
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

const addContactMiddleware = validateBody(createContactSchema);
const updateContactMiddleware = validateBody(updateContactSchema);
const updateStatusContactMiddleware = validateBody(updateStatusContactSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.post("/", addContactMiddleware, createContact);

contactsRouter.put("/:id", updateContactMiddleware, updateContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.patch(
  "/:contactId/favorite",
  updateStatusContactMiddleware,
  updateStatusContact
);

export default contactsRouter;
