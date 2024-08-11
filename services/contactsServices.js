import Contact from "../db/models/Contact.js";

const listContacts = () => Contact.findAll();

const getContactById = (id) => Contact.findByPk(id);

const removeContact = async (id) =>
  Contact.destroy({
    where: {
      id,
    },
  });

const addContact = (data) => Contact.create(data);

const updateContact = async (id, data) => {
  const Contact = await getContactById(id);
  if (!Contact) {
    return null;
  }
  return Contact.update(data, {
    returning: true,
  });
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
