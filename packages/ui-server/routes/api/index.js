const { Router } = require('express');

const init = require('./init');

const router = new Router();
router.get('/init', init);

module.exports = router;
