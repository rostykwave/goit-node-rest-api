import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import isEmptyObject from "../helpers/objectHelpers.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res, next) => {
  const result = await contactsService.listContacts();

  res.json(result);
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    message: "Contact deleted successfuly",
  });
};

const createContact = async (req, res, next) => {
  const result = await contactsService.addContact(req.body);

  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  if (isEmptyObject(req.body)) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;

  const result = await contactsService.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
