import express from 'express';
import {
  create,
  deleteUser,
  getAllUsers,
  getUserById,
  update,
  filterUsers,
} from '../controller/userController';

const route = express.Router();

route.post('/user', create);
route.get('/users/:page', (req, res) => {
  // If page is defined in the path, override the query parameter
  if (req.params.page) {
    req.query.page = req.params.page;
  }
  getAllUsers(req, res);
});

// route.get('/users/:page', getAllUsers);
// route.get('/users/:page', filterUsers)

route.get('/user/:id', getUserById);
route.put('/update/user/:id', update);
route.delete('/delete/user/:id', deleteUser);

export default route;
