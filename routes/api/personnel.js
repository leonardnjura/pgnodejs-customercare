const express = require('express');

const router = express.Router();

const { auth } = require('../../middleware/auth');
const personnelController = require('../../controllers/personnelController');
const { Personnel } = require('../../models/index');

// @route   GET api/auth/personnels
// @desc    Fetch all personnels
// @access  Public
router.get('/personnels', personnelController.fetchAllPersonnels);

// @route   GET api/auth/personnel/:id
// @desc    Fetch one personnel
// @access  Public
router.get('/personnels/:id', personnelController.fetchOnePersonnel);

// @route   POST api/auth/signup
// @desc    Register a personnel
// @access  Public
router.post(
  '/signup',
  personnelController.validate('addPersonnel'),
  personnelController.addPersonnel
);

// @route   POST api/auth/signin
// @desc    Log in a personnel
// @access  Public
router.post('/signin', personnelController.loginPersonnel);

// @route   GET api/auth/personnel or GET api/auth/whoami
// @desc    Determine personnel from token
// @access  Protected
router.get('/personnel', auth, (req, res) => {
  Personnel.findOne({
    where: { personnel_id: req.personnel.personnel_id },
    attributes: { exclude: ['password'] }
  }).then(personnel => res.json({ personnel }));
});
router.get('/whoami', auth, (req, res) => {
  Personnel.findOne({
    where: { personnel_id: req.personnel.personnel_id },
    attributes: { exclude: ['password'] }
  }).then(personnel => res.json(personnel));
});

module.exports = router;
