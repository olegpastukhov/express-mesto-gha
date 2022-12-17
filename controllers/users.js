// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// eslint-disable-next-line consistent-return
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    try {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const payload = { _id: user._id };
        const tokenKey = 'secret_token_key';
        const token = jwt.sign(payload, tokenKey);
        return res.status(200).json({ token });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    } catch (e) {
      return res.status(500).json({ message: 'Error' });
    }
  } catch (e) {
    return res.status(500).json({ message: 'Error' });
  }
};

const createUser = async (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  try {
    if (!email || !password) {
      return res.status(500).json({ message: 'Неправильный логин или пароль.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      name,
      about,
      avatar,
      password: hash,
    });
    return res.status(201).json({ _id: user._id });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: e.message });
    }
    return res.status(500).json({ message: 'Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ message: 'Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: 'UserId is not valid' });
    }
    return res.status(500).json({ message: 'Error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    // eslint-disable-next-line no-underscore-dangle
    const user = await User.findByIdAndUpdate(
      // eslint-disable-next-line no-underscore-dangle
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (user === null) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: e.message });
    }
    return res.status(500).json({ message: 'Error' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    // eslint-disable-next-line no-underscore-dangle
    const user = await User.findByIdAndUpdate(
      // eslint-disable-next-line no-underscore-dangle
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (user === null) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ avatar });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: 'ValidationError' });
    }
    return res.status(500).json({ message: 'Error' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
  login,
};
