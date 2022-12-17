const Card = require('../models/card');

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    // eslint-disable-next-line no-underscore-dangle
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(201).json(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: e.message });
    }
    return res.status(500).json({ message: 'Error' });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (e) {
    return res.status(500).json({ message: 'Error' });
  }
};

const deleteCard = async (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  try {
    const card = await Card.findOne(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    if (card.owner.valueOf() !== _id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const deletedCard = await Card.findByIdAndRemove(cardId);
    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.status(200).json(deletedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: 'CardId is not valid' });
    }
    return res.status(500).json({ message: 'Error' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      // eslint-disable-next-line no-underscore-dangle
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.status(200).json(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: 'CardId is not valid' });
    }
    return res.status(500).json({ message: 'Error' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      // eslint-disable-next-line no-underscore-dangle
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (card === null) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.status(200).json(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: 'CardId is not valid' });
    }
    return res.status(500).json({ message: 'Error' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
