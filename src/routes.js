import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.json({
    hello: true,
  });
});
// login
routes.post('/sessions', SessionController.store);
// signup
routes.post('/users', UserController.store);

routes.use(AuthMiddleware);
// ver agendamentos e prestadores
routes.get('/providers', ProviderController.index);
routes.get('/schedule', ScheduleController.index);
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
// perfil relacionados - edição e foto
routes.post('/files', upload.single('file'), FileController.store);

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

export default routes;
