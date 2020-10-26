import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import User from '../models/User';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv').config();

interface ParamsUserAccessToken {
  id: number;
}

export default {

    async generateAccessToken(params:ParamsUserAccessToken) {
      if(!process.env.ACCESS_TOKEN_SECRET){
        return;
      }
      return jwt.sign(params, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400,
      });
    },
 
    async index(request: Request, response: Response){
        const usersRepository = getRepository(User);

        const users = await usersRepository.find();
        return response.json(users);
    },

    async create(request: Request, response: Response) {
        const {
          name,
          email,
          password,
        } = request.body;

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
    
      const data = {
          name,
          email,
          password: passwordHash,
        }

        const schema = Yup.object().shape({
          name: Yup.string().required('Campo nome deve ser preenchido!'),
          email: Yup.string().email().required('Campo email deve ser preenchido!'),
          password: Yup.string().required('Campo senha deve ser preenchido')
        });

      await schema.validate(data, {
          abortEarly: false
      })

      const usersRepository = getRepository(User);
      const user = usersRepository.create(data);
      await usersRepository.save(user);

      user.password = '';

      const accessToken = await this.generateAccessToken({id : user.id});
      return response.status(201).json({
        user, 
        accessToken
      });
    },

    async login(request: Request, response: Response) {
      const {
        email,
        password,
      } = request.body;

      const data = {
        email,
        password
      }

      const schema = Yup.object().shape({
        email: Yup.string().email().required('Campo email deve ser preenchido!'),
        password: Yup.string().required('Campo senha deve ser preenchido')
      });

    await schema.validate(data, {
        abortEarly: false
    })

      const usersRepository = getRepository(User);
      const user = await usersRepository.findOne({ email });
      if(!user){
        return response.status(401).json({error: 'User not found'});
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);
      if(!isValidPassword){
        return response.status(401).json({error: 'Invalid password'});
      }
      user.password = '';

      if(!process.env.ACCESS_TOKEN_SECRET){
        return response.status(400).json({});
      }
    
      const accessToken = await this.generateAccessToken({id : user.id});
      return response.status(200).json({
        user, 
        accessToken
      });
    }

}