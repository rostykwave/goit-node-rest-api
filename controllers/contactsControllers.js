import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import isEmptyObject from "../helpers/objectHelpers.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const result = await contactsService.listContacts({ owner }, { page, limit });

  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;

  const result = await contactsService.getContactById({ id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;

  const result = await contactsService.removeContact({ id, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    message: "Contact deleted successfuly",
  });
};

const createContact = async (req, res) => {
  const { id: owner } = req.user;
  const result = await contactsService.addContact({ ...req.body, owner });

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  if (isEmptyObject(req.body)) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const { id: owner } = req.user;

  const result = await contactsService.updateContact({ id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  if (isEmptyObject(req.body)) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { contactId: id } = req.params;
  const { id: owner } = req.user;

  console.log("id", id);
  console.log("owner", owner);

  const result = await contactsService.updateStatusContact(
    { id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Not found`);
  }

  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
