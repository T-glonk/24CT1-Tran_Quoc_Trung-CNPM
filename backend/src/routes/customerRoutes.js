const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.addCustomer);
router.patch('/:id/toggle-status', customerController.toggleCustomerStatus);
router.patch('/:id/role', customerController.updateCustomerRole);

module.exports = router;
