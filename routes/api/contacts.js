const express = require('express');
const route = express.Router();

const contactsControllers = require('../../controllers/contacts');

const { contactsSchemas } = require('../../validators');
const { isValidateMongoId, validateBody, authenticate } = require('../../middlewares');

route.use(authenticate);

route.get('/', contactsControllers.listContacts);
route.get('/:contactId', isValidateMongoId, contactsControllers.getContactById);
route.post('/', validateBody(contactsSchemas.createContactsSchema), contactsControllers.addContact);
route.delete('/:contactId', contactsControllers.removeContact);
route.put(
	'/:contactId',
	isValidateMongoId,
	validateBody(contactsSchemas.createContactsSchema),
	contactsControllers.updateContact
);
route.patch(
	'/:contactId/favorite',
	isValidateMongoId,
	validateBody(contactsSchemas.updateFavoriteSchema),
	contactsControllers.updateStatusContact
);

module.exports = route;
