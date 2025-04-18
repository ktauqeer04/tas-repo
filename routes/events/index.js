const express = require('express');
const { UserAuth, ContentValidate } = require('../../middleware');
const { EventController } = require('../../controller');
const router = express.Router();

router.post('/', UserAuth.validateUser, ContentValidate.validateEventCreation, EventController.createEvent);
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getSpecificEvent);
router.put('/:id', UserAuth.validateUser, UserAuth.validateAdminBeforeUpdate, EventController.updateEvent);
router.delete('/:id',UserAuth.validateUser, UserAuth.validateAdminBeforeDelete, EventController.deleteEvent);
router.post('/:id/upload', UserAuth.validateUser, ContentValidate.validateImage, EventController.uploadImageBanner);


module.exports = router;