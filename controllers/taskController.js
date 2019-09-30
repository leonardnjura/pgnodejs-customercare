const { check, validationResult } = require('express-validator');

const Sequelize = require('sequelize');
const { Personnel, Task } = require('../models/index');
const { Op } = Sequelize;

// Task.belongsTo(Personnel, { foreignKey: 'personnel_id' });

/**
 * REST */
exports.fetchAllTasks = (req, res) => {
  const queRRi = {};
  let pageNo = 1;
  let pageSize = 10;
  let totalCount = null;
  let totalPages = null;
  queRRi.include = [];
  queRRi.order = [['task_id', 'DESC']];
  const cols = ['task_id', 'personnel_id', 'customer_id', 'completed'];

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

  Task.count()
    .then(count => {
      totalCount = count;
      totalPages = Math.ceil(totalCount / pageSize);
    })
    .catch(err => console.log(err));

  Task.findAll(queRRi).then(tasks => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const nextPage = pageNo + 1;
    let nextPageLink = `${fullUrl
      .split('?')
      .shift()}?pageNo=${nextPage}&pageSize=${pageSize}`;
    if (nextPage > totalPages) {
      nextPageLink = null;
    }
    return res.status(200).json({
      tasks,
      count: totalCount,
      countPerPage: pageSize,
      totalPages,
      nextPageLink
    });
  });
};

exports.searchAllTasks = (req, res) => {
  let { term } = req.query;
  term = term.toLowerCase();
  Task.findAll({
    where: { customer_last_name: { [Op.like]: `%${term}%` } }
  }).then(results => res.json({ results }));
};

exports.fetchOneTask = (req, res) => {
  const task_id = parseInt(req.params.id, 10);
  Task.findOne({
    where: { task_id },
    include: []
  })
    .then(task => {
      if (!task) {
        // task object is always there but object may be null
        return res.status(404).json({ success: false, msg: '!Task not found' });
      }
      return res.json({ task });
    })
    .catch(err => res.status(400).json({ success: false, error: err }));
};

exports.updateTaskOwner = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { personnel_id } = req.body;

  Task.findOne({ where: { task_id: req.params.id } })
    .then(task => {
      if (!task) {
        return res.status(404).json({ success: false, msg: '!Task not found' });
      }

      /**
       * update already? no wait..
       * only admin to finish this */
      let userMsg = '!Oops, you are not allowed to update';
      const surfer = req.personnel.personnel_id;

      Personnel.findOne({
        where: { personnel_id: surfer, personnel_type_id: 3 }
      }).then(personnel => {
        if (personnel) {
          userMsg = '!Task successfully assigned';
          // admin may save
          Task.findOne({
            where: { task_id: req.params.id }
          }).then(task => {
            return task
              .update({
                personnel_id
              })
              .then(() =>
                res.status(200).json({ task, success: true, msg: userMsg })
              );
          });
        } else {
          // nobody else should save
          return res.status(401).json({ success: false, msg: userMsg, surfer });
        }
      });
    })
    .catch(err => res.status(400).json({ success: false, error: err }));
};

exports.deleteTask = (req, res) => {
  const task_id = parseInt(req.params.id, 10);
  Task.findOne({ where: { task_id } }).then(task => {
    if (!task) {
      return res.status(404).json({ success: false, msg: '!Task not found' });
    }

    /**
     * delete already? no wait..
     * only  admin to finish this */
    let personnelMsg = '!Oops, you are not allowed to delete';
    const surfer = req.personnel.personnel_id;
    console.log({ surfer });

    Personnel.findOne({ where: { personnel_id: surfer, personnel_type_id: 3 } })
      .then(personnel => {
        if (personnel) {
          personnelMsg = `!Admin deleted task with ID: ${task_id}`;
          // admin may expunge too
          Task.findOne({
            where: { task_id: req.params.id }
          }).then(task => {
            return task
              .destroy()
              .then(() =>
                res
                  .status(200)
                  .json({ success: true, msg: personnelMsg, surfer })
              );
          });
        } else {
          // nobody else should expunge
          return res
            .status(401)
            .json({ success: false, msg: personnelMsg, surfer });
        }
      })
      .catch(err => res.status(400).json({ success: false, error: err }));
  });
};

/**
 * VALIDATE TASK */
exports.validate = method => {
  switch (method) {
    case 'updateTaskOwner': {
      return [
        check('personnel_id')
          .not()
          .isEmpty()
          .withMessage('personnel_id is required')
          .isIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
          .withMessage('status must be between 1 and 10')
      ];
    }

    default:
      return [];
  }
};
