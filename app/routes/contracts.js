const express = require('express');
const ContractsController = require('../controllers/contracts.controller');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/', checkAuth, ContractsController.all);
router.get('/:id', checkAuth, ContractsController.one);

module.exports = router;
