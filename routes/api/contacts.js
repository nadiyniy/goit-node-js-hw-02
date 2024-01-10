const express = require('express');
const router = express.Router();

const contactsControllers = require('../../controllers/contacts');
const { validateBody } = require('../../decorators/');
const { contactsSchemas } = require('../../validators');
const { isValidateMongoId } = require('../../middelwares');

router.get('/', contactsControllers.listContacts);

router.get('/:contactId', isValidateMongoId, contactsControllers.getContactById);

router.post('/', validateBody(contactsSchemas.createContactsSchema), contactsControllers.addContact);

router.delete('/:contactId', contactsControllers.removeContact);

router.put(
	'/:contactId',
	isValidateMongoId,
	validateBody(contactsSchemas.createContactsSchema),
	contactsControllers.updateContact
);

router.patch(
	'/:contactId/favorite',
	isValidateMongoId,
	validateBody(contactsSchemas.updateFavoriteSchema),
	contactsControllers.updateStatusContact
);

module.exports = router;
