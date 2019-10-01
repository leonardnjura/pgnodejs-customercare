const express = require('express');

const router = express.Router();

const { auth, adminOnly } = require('../../middleware/auth');
const taskController = require('../../controllers/taskController');

// @route   GET api/tasks
// @desc    Fetch all tasks
// @access  Public
router.get('/', taskController.fetchAllTasks);

// @route   POST api/tasks
// @desc    Create a task
// @access  Protected
router.post(
  '/',
  auth,
  taskController.validate('addTask'),
  taskController.addTask
);

// @route   GET api/tasks/search?term=type
// @desc    Search all tasks
// @access  Public
router.get('/search', taskController.searchAllTasks);

// @route   GET api/tasks/:id
// @desc    Fetch one task
// @access  Public
router.get('/:id', taskController.fetchOneTask);

// @route   PATCH api/tasks/:id/assign
// @desc    Assigns task to a different personnel
// @access  Protected, admin?
router.patch(
  '/:id/assign',
  auth,
  taskController.validate('updateTaskOwner'),
  taskController.updateTaskOwner
);

// @route   PATCH api/tasks/:id/completed
// @desc    Sets task status as completed( or deferred)
// @access  Protected, admin?
router.patch(
  '/:id/completed',
  auth,
  taskController.validate('updateTaskStatus'),
  taskController.updateTaskStatus
);

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Protected, admin
router.delete('/:id', adminOnly, taskController.deleteTask);

module.exports = router;
