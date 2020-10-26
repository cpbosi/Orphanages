import {request, response, Router} from 'express';
import multer from 'multer';
import OrphanagesController from './controllers/OrphanagesController';
import uploadConfig from './config/upload';
import UsersController from './controllers/UsersController';
import auth from './middlewares/auth';

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

routes.post("/users/login", async (request, response) => {
    UsersController.login(request, response);
});

//habilitado autenticacao apenas nessa rota para testar.
routes.get('/testauth' , auth, async(request, response) =>{
    response.send({ok: true});
});

export default routes;