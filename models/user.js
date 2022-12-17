const mongoose = require('mongoose');
// eslint-disable-next-line import/no-unresolved
// const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
// const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    // required: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    // required: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // required: true,
  },
});

// // eslint-disable-next-line func-names
// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email }).select('+password').then((user) => {
//     // пользователь не нашёлся — отклоняем промис
//     if (!user) {
//       throw new UnauthorizedError('Неправильные почта или пароль');
//     }

//     // нашёлся — сравниваем хеши
//     return bcrypt.compare(password, user.password).then((matched) => {
//       // хеши не совпали — отклоняем промис
//       if (!matched) {
//         throw new UnauthorizedError('Неправильные почта или пароль');
//       }
//       // аутентификация успешна
//       return user;
//     });
//   });
// };

module.exports = mongoose.model('user', userSchema);
