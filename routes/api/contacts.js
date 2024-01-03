const express = require('express');
const router = express.Router();

const contactsControllers = require('../../controllers/contacts');
const { validateBody } = require('../../decorators/');
const { contactsSchemas } = require('../../validators');

router.get('/', contactsControllers.listContacts);

router.get('/:contactId', contactsControllers.getContactById);

router.post('/', validateBody(contactsSchemas.createContactsSchema), contactsControllers.addContact);

router.delete('/:contactId', contactsControllers.removeContact);

router.put('/:contactId', validateBody(contactsSchemas.createContactsSchema), contactsControllers.updateContact);

module.exports = router;
