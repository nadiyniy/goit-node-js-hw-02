const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');
const Contact = require('../models/contact');

const listContacts = async (req, res, next) => {
	const { _id: owner } = req.user;
	const { limit = 10, page = 1 } = req.query;
	const skip = (page - 1) * limit;
	const data = await Contact.find({ owner }).skip(skip).limit(limit).populate('owner', 'email name');
	const count = await Contact.countDocuments({ owner });
	console.log(count);
	const totalPages = Math.round(count / +limit);
	const pagination = {
		perPage: +limit,
		count: data.length,
		page: +page,
		totalPages,
	};
	res.json({ data, pagination });
};

const getContactById = async (req, res, next) => {
	const { contactId } = req.params;
	const contact = await Contact.findById(contactId);

	if (!contact) {
		throw HttpError(404, `Contact with id ${contactId} not found`);
	}
	res.json(contact);
};

const addContact = async (req, res, next) => {
	const { _id } = req.user;
	const body = req.body;
	const newContact = await Contact.create({ ...body, owner: _id });
	res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
	const { contactId } = req.params;
	const { name, email, phone } = req.body;
	const updateContact = await Contact.findByIdAndUpdate(contactId, { name, email, phone }, { new: true });
	if (!updateContact) {
		throw HttpError(404, `Contact with id ${contactId} not found`);
	}
	res.status(201).json(updateContact);
};

const removeContact = async (req, res, next) => {
	const { contactId } = req.params;
	const deleteContact = await Contact.findByIdAndDelete(contactId);

	if (!deleteContact) {
		throw HttpError(404, `Contact with id ${contactId} not found`);
	}
	res.json({ message: 'Contact deleted' });
};

const updateStatusContact = async (req, res, next) => {
	const { contactId } = req.params;
	const { favorite } = req.body;
	const updateContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });

	if (favorite === undefined) {
		throw HttpError(400, 'missing field favorite');
	}

	if (!updateContact) {
		throw HttpError(404, `Not found `);
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
