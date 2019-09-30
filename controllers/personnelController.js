const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const moment = require('moment');

const Sequelize = require('sequelize');
const { generateToken } = require('../middleware/auth');
const { Personnel, Task } = require('../models/index');

const { Op } = Sequelize;

/**
 * REST */
exports.fetchAllPersonnels = (req, res) => {
  const queRRi = {};
  let pageNo = 1;
  let pageSize = 10;
  let totalCount = null;
  let totalPages = null;
  queRRi.include = [];
  queRRi.order = [['personnel_id', 'DESC']];
  const cols = [
    'personnel_id',
    'personnel_fname',
    'personnel_onames',
    'personnel_email'
  ];

  if (req.query.include) {
    const include = parseInt(req.query.include, 10);
    if (include === 0) queRRi.include = [];
  }

  if (req.query.orderBy) {
    const { orderBy } = req.query;
    if (cols.includes(orderBy)) {
      queRRi.order = [[orderBy, 'ASC']];
    }
  }

  if (req.query.pageNo) {
    const personnelPageNo = parseInt(req.query.pageNo, 10);
    if (personnelPageNo < 0 || personnelPageNo === 0)
      return res
        .status(400)
        .json({ msg: '!Invalid page number, should start with 1' });
    pageNo = personnelPageNo;
  }

  if (req.query.pageSize) {
    const personnelPageSize = parseInt(req.query.pageSize, 10);
    if (personnelPageSize < 0 || personnelPageSize === 0)
      return res
        .status(400)
        .json({ msg: '!Invalid page size, should start with 1' });
    pageSize = personnelPageSize;
  }

  if (pageNo) {
    queRRi.offset = pageSize * (pageNo - 1);
    queRRi.limit = pageSize;
  }
  queRRi.where = {};

  Personnel.count()
    .then(count => {
      totalCount = count;
      totalPages = Math.ceil(totalCount / pageSize);
    })
    .catch(err => console.log(err));

  Personnel.findAll(queRRi)
    .then(personnels => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const nextPage = pageNo + 1;
      let nextPageLink = `${fullUrl
        .split('?')
        .shift()}?pageNo=${nextPage}&pageSize=${pageSize}`;
      if (nextPage > totalPages) {
        nextPageLink = null;
      }
      res.status(200).json({
        personnels,
        count: totalCount,
        countPerPage: pageSize,
        totalPages,
        nextPageLink
      });
    })
    .catch(err => console.log(err));
};

exports.fetchOnePersonnel = (req, res) => {
  const personnel_id = parseInt(req.params.id, 10);
  Personnel.findOne({ where: { personnel_id }, include: [] })
    .then(personnel => {
      if (!personnel) {
        // personnel object is always there but object may be null
        return res
          .status(404)
          .json({ success: false, msg: '!Personnel not found' });
      }
      return res.json({ personnel });
    })
    .catch(err => res.status(400).json({ success: false, error: err }));
};

exports.addPersonnel = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    personnel_fname,
    personnel_onames,
    personnel_phone,
    personnel_password
  } = req.body;

  Personnel.findOne({ where: { personnel_phone } })
    .then(personnel => {
      if (personnel)
        return res.status(400).json({ msg: '!Personnel already exists' });

      // all ok
      const newPersonnel = new Personnel({
        personnel_fname,
        personnel_onames,
        personnel_phone,
        personnel_password
      });

      // salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPersonnel.personnel_password, salt, (err, hash) => {
          if (err) throw err;
          newPersonnel.personnel_password = hash;
          newPersonnel.save().then(personnel => {
            const token = generateToken(personnel);
            // signup saa..
            const today = moment()
              .local()
              .format('dddd');
            const now = moment()
              .local()
              .format('Do MMMM, YYYY hh:mma');
            const time = `${today} ${now};`;
            res.status(201).json({ token, time, personnel });
          });
        });
      });
    })
    .catch(err => res.status(400).json({ success: false, error: err }));
};

exports.loginPersonnel = (req, res) => {
  const { personnel_phone, personnel_password } = req.body;
  // custom validation, :)
  if (!personnel_phone || !personnel_password) {
    return res
      .status(400)
      .json({ msg: '!Please login with phone and password' });
  }
  Personnel.findOne({ where: { personnel_phone } })
    .then(personnel => {
      // existing personnel?
      if (!personnel)
        return res.status(400).json({ msg: '!Personnel does not exist' });

      // validate password..
      bcrypt
        .compare(personnel_password, personnel.personnel_password)
        .then(isMatch => {
          if (!isMatch)
            return res.status(400).json({ msg: '!Invalid credentials' });
          const token = generateToken(personnel);
          // login saa..
          const today = moment().format('dddd');
          const now = moment().format('Do MMMM, YYYY hh:mma');
          const time = `${today} ${now};`;
          res.json({ token, time, personnel });
        });
    })
    .catch(err => res.status(400).json({ success: false, error: err }));
};

/**
 * VALIDATE PERSONNEL */
//personnel_fname, personnel_onames, personnel_phone, personnel_password
exports.validate = method => {
  switch (method) {
    case 'addPersonnel': {
      return [
        check('personnel_fname')
          .not()
          .isEmpty()
          .withMessage('personnel_fname is required')
          .trim()
          .escape(),
        check('personnel_onames')
          .optional()
          .trim()
          .escape(),
        check('personnel_phone')
          .not()
          .isEmpty()
          .withMessage('personnel_phone is required')
          .trim()
          .escape(),
        check('personnel_email')
          .optional()
          .isEmail()
          .withMessage('valid personnel_email is required')
          .trim()
          .escape()
          .normalizeEmail(),
        check('personnel_password', '')
          .not()
          .isEmpty()
          .withMessage('password is required')
          .isLength({ min: 4 })
          .withMessage('must be at least 4 chars long')
          .matches(/\d/)
          .withMessage('must contain a number')
      ];
    }

    default:
      return [];
  }
};
