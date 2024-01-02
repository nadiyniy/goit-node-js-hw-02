const { v4: uuidv4 } = require('uuid');

const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
	const data = await fs.readFile(contactsPath, 'utf-8');
	return JSON.parse(data);
};

const getContactById = async (contactId) => {
	const contacts = await listContacts();
	const foundContact = contacts.find((contact) => contact.id === contactId);
	return foundContact || null;
};

const removeContact = async (contactId) => {
	const contacts = await listContacts();
	const index = contacts.findIndex((contact) => contact.id === contactId);

	if (index === -1) {
		return null;
	}
	const removeContact = contacts.splice(index, 1);
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

	return removeContact;
};

const addContact = async ({ name, email, phone }) => {
	const contacts = await listContacts();
	const newContact = { id: uuidv4(), name, email, phone };

	contacts.push(newContact);

	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return newContact;
};

const updateContact = async (contactId, { name, email, phone }) => {
	const contacts = await listContacts();
	const index = contacts.findIndex((contact) => contact.id === contactId);

	if (index === -1) {
		return null;
	}

	contacts[index] = {
		...contacts[index],
		name: name || contacts[index].name,
		email: email || contacts[index].email,
		phone: phone || contacts[index].phone,
	};

	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return contacts[index];
};

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
