const express = require('express');
const router = express.Router();
const ContractsController = require('../controllers/contracts.controller');
const checkAuth = require('../middleware/checkAuth');

router.get('/', checkAuth, ContractsController.all);
router.get('/:id', checkAuth, ContractsController.one);

module.exports = router;
