const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');

router.get('/', courtController.getAllCourts);
router.get('/clubs/all', courtController.getClubs);
router.get('/:id', courtController.getCourtById);
router.post('/', courtController.addCourt);
router.patch('/:id/status', courtController.updateCourtStatus);
router.patch('/:id/price', courtController.updateCourtPrice);

module.exports = router;
