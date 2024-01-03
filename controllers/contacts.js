const contactFunction = require('../models/contacts');

// const booksFunctions = require("../models/books");
const { httpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');

const listContacts = async (req, res, next) => {
	const contacts = await contactFunction.listContacts();
	res.json(contacts);
};

const getContactById = async (req, res, next) => {
	const { contactId } = req.params;
	const contact = await contactFunction.getContactById(contactId);

	if (!contact) {
		throw httpError(404, `Book with id ${contactId} not found`);
	}
	res.json(contact);
};

const addContact = async (req, res, next) => {
	const { name, email, phone } = req.body;
	const newContact = await contactFunction.addContact({ name, email, phone });
	res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
	const { contactId } = req.params;
	const { name, email, phone } = req.body;
	const updateContact = await contactFunction.updateContact(contactId, { name, email, phone });
	if (!updateContact) {
		throw httpError(404, `Book with id ${contactId} not found`);
	}
	res.status(201).json(updateContact);
};

const removeContact = async (req, res, next) => {
	const { contactId } = req.params;
	const deleteContact = await contactFunction.removeContact(contactId);

	if (!deleteContact) {
		throw httpError(404, `Book with id ${contactId} not found`);
	}
	res.json({ message: 'Contact deleted' });
};

module.exports = {
	listContacts: ctrlWrapper(listContacts),
	getContactById: ctrlWrapper(getContactById),
	addContact: ctrlWrapper(addContact),
	updateContact: ctrlWrapper(updateContact),
	removeContact: ctrlWrapper(removeContact),
};
