const express = require('express');

const router = express.Router();

const contactFunction = require('../../models/contacts');

const Joi = require('joi');

const contactsSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
	try {
		const contacts = await contactFunction.listContacts();
		res.json(contacts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const contact = await contactFunction.getContactById(contactId);

		if (contact) {
			res.json(contact);
		} else {
			res.status(404).json({ message: 'Not found' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { name, email, phone } = req.body;
		const { error } = contactsSchema.validate({ name, email, phone });

		if (error) {
			return res.status(400).json({ message: error.message });
		}

		const newContact = await contactFunction.addContact({ name, email, phone });
		res.status(201).json(newContact);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const result = await contactFunction.removeContact(contactId);

		if (result) {
			res.json({ message: 'Contact deleted' });
		} else {
			res.status(404).json({ message: 'Not found' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params;

		const { name, email, phone } = req.body;
		const { error } = contactsSchema.validate({ name, email, phone });

		if (error) {
			return res.status(400).json({ message: error.message });
		}

		const updateContact = await contactFunction.updateContact(contactId, { name, email, phone });
		res.status(201).json(updateContact);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
