import api from './api';

const getUsers = () => {
  return api.get('/user/all');
};

const userService = {
  getUsers,
};

export default userService;
