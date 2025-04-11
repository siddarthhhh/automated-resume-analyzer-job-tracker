// routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');

// 🔐 Middleware to check token
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

// @route   POST /api/jobs
// @desc    Add new job
router.post('/', authMiddleware, async (req, res) => {
  const { company, position, status } = req.body;

  try {
    const job = new Job({
      user: req.user.id,
      company,
      position,
      status,
    });

    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs/dashboard
// @desc    Get all jobs for a user
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ appliedAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
