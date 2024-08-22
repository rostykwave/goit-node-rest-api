import Contact from "../db/models/Contact.js";

const listContacts = (query = {}, { page = 1, limit = 10 }) => {
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;
  return Contact.findAll({
    where: query,
    offset,
    limit: normalizedLimit,
  });
};

const getContactById = (query) =>
  Contact.findOne({
    where: query,
  });

const removeContact = async (query) =>
  Contact.destroy({
    where: query,
  });

const addContact = (data) => Contact.create(data);

const updateContact = async (query, data) => {
  const Contact = await getContactById(query);
  if (!Contact) {
    return null;
  }
  return Contact.update(data, {
    returning: true,
  });
};

const updateStatusContact = async (query, body) => {
  const Contact = await getContactById(query);
  if (!Contact) {
    return null;
  }
  return Contact.update(
    { favorite: body.favorite },
    {
      returning: true,
    }
  );
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
