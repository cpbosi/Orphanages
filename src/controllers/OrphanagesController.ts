import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import orphanagesView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
    async index(request: Request, response: Response){
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });
        return response.json(orphanageView.renderMany(orphanages));
    },

    async create(request: Request, response: Response) {
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
          } = request.body;

        const orphanagesRepository = getRepository(Orphanage);
        const requestImages = request.files as Express.Multer.File[];

        const images = requestImages.map(image => {
                return { path: image.filename }
        });
        
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images,
          };

          const schema = Yup.object().shape({
            name: Yup.string().required('Campo nome deve ser preenchido!'),
            latitude: Yup.number().required('Campo latitude deve ser preenchido!'),
            longitude: Yup.number().required('Campo longitude deve ser preenchido!'),
            about: Yup.string().required().max(300, 'Deve ter menos de 300 caracteres!'),
            instructions: Yup.string().required('Campo instrucoes deve ser preenchido!'),
            opening_hours: Yup.string().required('Campo Horario de visitas deve ser preenchido!'),
            open_on_weekends: Yup.boolean(),
            images: Yup.array(
              Yup.object().shape({
                path: Yup.string().required(),
              })
            ).required().min(1),
          });

        await schema.validate(data, {
            abortEarly: false
        })

        const orphanage = orphanagesRepository.create(data);
        await orphanagesRepository.save(orphanage);
    
        return response.status(201)
        .json(orphanagesView.render(orphanage));
    },

    async show(request: Request, response: Response){
        const {id} = request.params
        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });
        return response.json(orphanageView.render(orphanage));
    },
}