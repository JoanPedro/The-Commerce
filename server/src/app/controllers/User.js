// import mongoose from 'mongoose';
import User from '../models/User';
// import sendEmailRecovery from '../../'

class UserController {
  async index(req, res, next) {
    const user = req.payload;

    await User.findById(user.id)
      .then((users) => {
        if (!users)
          return res.status(401).json({ errors: 'User does not registred.' });

        return res.json({ user: users.sendAuth() });
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

    if (!name || !email || !password)
      return res.status(422).json({ errors: 'This fields are required.' });

    const user = await new User({ name, email });
    await user.setPassword(password);

    await user
      .save()
      .then(() => res.json({ user: user.sendAuth() }))
      .catch(next);

    return '';
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

        return user.save().then(() => {
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
          .then(() => {
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

  showRecobery(req, res) {
    return res.render('recovery', { error: null, success: null });
  }

  async createRecovery(req, res, next) {
    const { email } = req.body;

    if (!email)
      return res.render('recovery', {
        error: 'Feed with your email',
        success: null,
      });

    await User.findOne({ email })
      .then((user) => {
        if (!user)
          return res.render('recovery', {
            error: 'Does not exist user with this email',
            success: null,
          });

        const recoveryData = user.recuperationToken();

        return user
          .save()
          .then(() => {
            return res.render('recovery', { error: null, success: true });
          })
          .catch(next);
      })
      .catch(next);
    return '';
  }

  async showCompleteRecovery(req, res, next) {
    if (!req.query.token)
      return res.render('recovery', {
        error: 'Token is not identified',
        success: null,
      });
    await User.findOne({ 'recovery.token': req.query.token })
      .then((user) => {
        if (!user)
          return res.render('recovery', {
            error: 'Does not exist user with this email',
            success: null,
          });
        if (new Date(user.recovery.date) < new Date())
          return res.render('recovery', {
            error: 'This token was expired.',
            success: null,
          });
        return res.render('recovery/store', {
          error: null,
          success: null,
          token: req.query.token,
        });
      })
      .catch(next);

    return '';
  }

  async completeRecovery(req, res, next) {
    const { token, password } = req.body;
    if (!token || !password)
      return res.render('recovery/store', {
        error: 'Please, try again with a new password',
        success: null,
        token,
      });

    await User.findOne({ 'recovery.token': token }).then((user) => {
      if (!user)
        return res.render('recovery', {
          error: 'This user has not identified.',
          success: null,
        });

      user.recuperationEnd();
      user.setPassword(password);

      return user
        .save()
        .then(() => {
          return res.render('recovery/store', {
            error: null,
            success:
              'The password has been succeeded to change. Try login again.',
            token: null,
          });
        })
        .catch(next);
    });
    return '';
  }
}

export default new UserController();
