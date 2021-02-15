import { Response, Request } from 'miragejs';
import { handleErrors } from '../server';
import { User } from '../../../interfaces/user.interface';
import { randomBytes } from 'crypto';

const generateToken = () => randomBytes(8).toString('hex');

export interface AuthResponse {
  token: string;
  user: User;
}

const login = (schema: any, req: Request): AuthResponse | Response => {
  const { username, password } = JSON.parse(req.requestBody);
  const user = schema.users.findBy({ username });
  if (!user) {
    return handleErrors(null, 'No User Found ');
  }
  if (password !== user.password) {
    return handleErrors(null, 'Password Is Wrong');
  }
  const token = generateToken();
  return {
    user: user.attrs as User,
    token,
  };
};

const signup = (schema: any, req: Request): AuthResponse | Response => {
  const data = JSON.parse(req.requestBody);
  const exUser = schema.users.findBy({ username: data.username });
  if (exUser) {
    return handleErrors(null, 'Already User Exists Try new one.');
  }
  const user = schema.users.create(data);
  const token = generateToken();
  return {
    user: user.attrs as User,
    token,
  };
};

export default {
  login,
  signup,
};
