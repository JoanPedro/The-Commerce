import jwt from 'express-jwt';
import { secret } from '../../../config/index';

const getTokenFromHeader = (req) => {
  if (!req.headers.authorization) return null;
  const token = req.header.authorization.split(' ')[1];
  // Beater Token...
  // Split para separar o Bearer do Token.
  if (token[0] !== 'Ecommerce') return null;
  // Ecommerce + Token ...
  return token[1];
};

const auth = {
  required: jwt({
    secret,
    userProperty: 'payload', // Req.payload
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret,
    userProperty: 'payload', // Req.payload
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

export default auth;
