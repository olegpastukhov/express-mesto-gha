const User = require('../models/user');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error' });
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user === null) {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error' });
  }

};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      return res.status(400).json({ message: 'Переданы некорректные данные' });
    }
    // eslint-disable-next-line no-underscore-dangle
    const user = await User.findByIdAndUpdate(req.user._id, {
      name,
      about,
    });
    return res.status(201).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    // eslint-disable-next-line no-underscore-dangle
    const user = await User.findByIdAndUpdate(req.user._id, { avatar });
    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
};
