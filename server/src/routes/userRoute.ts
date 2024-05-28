import express from 'express';
import { create, deleteUser, getAllUsers, getUserById, update } from '../controller/userController';

const route = express.Router();

route.post('/user', create);
route.get('/users', getAllUsers); // This route handles pagination
route.get('/user/:id', getUserById);
route.put('/update/user/:id', update);
route.delete('/delete/user/:id', deleteUser);

export default route;