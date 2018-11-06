const { Router } = require('express');

const init = require('./init');

const router = new Router();
router.post('/init', init);

module.exports = router;
