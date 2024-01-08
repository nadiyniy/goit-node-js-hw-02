const { httpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');
const Contact = require('../models/contact');

const listContacts = async (req, res, next) => {
	const contacts = await Contact.find();
	res.json(contacts);
};

const getContactById = async (req, res, next) => {
	const { contactId } = req.params;
	const contact = await Contact.findById(contactId);

	if (!contact) {
		throw httpError(404, `Book with id ${contactId} not found`);
	}
	res.json(contact);
};

const addContact = async (req, res, next) => {
	const { name, email, phone } = req.body;
	const newContact = await Contact.create({ name, email, phone });
	res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
	const { contactId } = req.params;
	const { name, email, phone } = req.body;
	const updateContact = await Contact.findByIdAndUpdate(contactId, { name, email, phone }, { new: true });
	if (!updateContact) {
		throw httpError(404, `Book with id ${contactId} not found`);
	}
	res.status(201).json(updateContact);
};

const removeContact = async (req, res, next) => {
	const { contactId } = req.params;
	const deleteContact = await Contact.findByIdAndDelete(contactId);

	if (!deleteContact) {
		throw httpError(404, `Book with id ${contactId} not found`);
	}
	res.json({ message: 'Contact deleted' });
};

const updateStatusContact = async (req, res, next) => {
	const { contactId } = req.params;
	const { favorite } = req.body;
	const updateContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });

	if (favorite === undefined) {
		throw httpError(400, 'missing field favorite');
	}

	if (!updateContact) {
		throw httpError(404, `Not found `);
	}
	res.status(201).json(updateContact);
};

module.exports = {
	listContacts: ctrlWrapper(listContacts),
	getContactById: ctrlWrapper(getContactById),
	addContact: ctrlWrapper(addContact),
	updateContact: ctrlWrapper(updateContact),
	removeContact: ctrlWrapper(removeContact),
	updateStatusContact: ctrlWrapper(updateStatusContact),
};
