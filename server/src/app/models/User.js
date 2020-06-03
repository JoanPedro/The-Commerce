import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { secret } from '../../config/index';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required.'],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'User email is required.'],
      index: true,
      // Formatação regex: Texto + '@' + '.' + texto
      match: [/\S+@\S+\.\S+/, 'The user email is invalid. '],
    },
    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Market',
      required: [true, 'Marketplace can not be empty.'],
    },
    permission: {
      type: Array,
      default: ['client'],
    },
    hash: String,
    salt: String,
    recovery: {
      type: {
        token: String,
        date: Date,
      },
      default: {},
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'It is already being used.' });

UserSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.passwordValidator = (password) => {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return hash === this.hash;
};

UserSchema.methods.generateToken = () => {
  const today = new Date();
  const exp = new Date(today);

  exp.setDate(today.getDate() + 15);
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      name: this.name,
      exp: parseFloat(exp.getTime() / 1000, 10),
    },
    secret
  );
};

UserSchema.methods.sendAuth = () => {
  return {
    name: this.name,
    email: this.email,
    market: this.market,
    role: this.permission,
    token: this.gerarToken(),
  };
};

UserSchema.methods.recuperationToken = () => {
  this.recovery = {};
  this.recovery.token = crypto.randomBytes(16).toString('hex');
  this.recovery.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  return this.recovery;
};

UserSchema.methods.recuperationEnd = () => {
  this.recovery = { token: null, date: null };

  return this.recovery;
};

export default mongoose.model('User', UserSchema);
