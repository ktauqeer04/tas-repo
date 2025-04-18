const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const eventRouer = require('./events');

router.use('/auth', authRouter);
router.use('/events', eventRouer);

module.exports = router;