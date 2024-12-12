const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const generateJWTToken = require('../utils/generateJWTToken');

exports.register = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = generateJWTToken(user.id, user.role);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

exports.login = [
  body('email').notEmpty(),
  body('password').notEmpty(),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
  
      const token = generateJWTToken(user.id, user.role);
  
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];
