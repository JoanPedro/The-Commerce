import mongoose from 'mongoose';
import User from '../models/User';
// import sendEmailRecovery from '../../'

class UserController {
  async index(req, res, next) {
    const user = req.payload;

    await User.findById(user.id)
      .then((user) => {
        if (!user)
          return res.status(401).json({ errors: 'User does not registred.' });

        return res.json({ user: user.sendAuth() });
      })
      .catch(next);
  }

  async show(req, res, next) {
    const userId = req.params.id;

    await User.findById(userId)
      .populate({ path: 'Market' })
      .then((user) => {
        if (!user)
          return res.status(401).json({ errors: 'User does not registred.' });
        console.log(user);
        return res.json({
          user: {
            name: user.name,
            email: user.email,
            permission: user.permission,
            market: user.market,
          },
        });
      })
      .catch(next);
  }

  async store(req, res, next) {
    const { name, email, password } = req.body;

    const user = await new User({ name, email });
    await user.setPassword(password);

    await user
      .save()
      .then((_) => res.json({ user: user.sendAuth() }))
      .catch(next);
  }

  async update(req, res, next) {
    const { name, email, password } = req.body;
    const userId = req.payload.id;

    await User.findById(userId)
      .then((user) => {
        if (!user)
          return res.status(401).json({ errors: 'User does not registred.' });
        if (typeof name !== 'undefined') user.name = name;
        if (typeof email !== 'undefined') user.email = email;
        if (typeof password !== 'undefined') user.setPassword(password);

        return user.save().then((_) => {
          return res.json({ user: user.sendAuth() });
        });
      })
      .catch(next);
  }

  async remove(req, res, next) {
    const userId = req.payload.id;

    await User.findById(userId)
      .then((user) => {
        if (!user)
          return res.status(401).json({ errors: 'User does not registred.' });

        return user
          .remove()
          .then((_) => {
            return res.json({ deleted: true });
          })
          .catch(next);
      })
      .catch(next);
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    if (!email)
      return res
        .status(422)
        .json({ errors: { email: 'Does not can be empty' } });
    if (!password)
      return res
        .status(422)
        .json({ errors: { password: 'Does not can be empty' } });

    await User.findOne({ email })
      .then((user) => {
        if (!user)
          return res.status(401).json({ errors: 'User does not registred.' });
        if (!user.passwordValidator(password))
          return res.status(401).json({ errors: 'Password invalid' });

        return res.json({ user: user.sendAuth() });
      })
      .catch(next);

    return '';
  }
}

export default new UserController();
