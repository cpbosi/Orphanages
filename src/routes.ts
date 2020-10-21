import {request, response, Router} from 'express';
import multer from 'multer';
import OrphanagesController from './controllers/OrphanagesController';
import uploadConfig from './config/upload';
import UsersController from './controllers/UsersController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get("/orphanages", async (request, response) => {
    OrphanagesController.index(request, response);
});

routes.get("/orphanages/:id", async (request, response) => {
    OrphanagesController.show(request, response);
});

routes.post("/orphanages", upload.array('images'), async (request, response) => {
    OrphanagesController.create(request, response);
});

routes.get("/users", async (request, response) => {
    UsersController.index(request, response);
});

routes.post("/users", async (request, response) => {
    UsersController.create(request, response);
});

export default routes;