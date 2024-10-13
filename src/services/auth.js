import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const saveToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const saveUser = (user) => {
  Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
};

export const getUser = () => {
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
};
