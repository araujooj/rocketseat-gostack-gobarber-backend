import { Router } from 'express';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/signup', UserController.store);

routes.get('/users', UserController.findAllUsers);

export default routes;
