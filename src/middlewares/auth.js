import jwt from 'jsonwebtoken';
require('dotenv').config();

export default function(request, response, next){
        const authHeader = request.headers.authorization;

        if (!authHeader){
            return response.status(401).send({error: 'No token provided'});
        }

        const parts = authHeader.split(' ');
        if(!parts.length === 2){
            response.status(401).send({error: 'Invalid token'});
        }

        const [scheme, token] = parts;
        if(!/^Bearer$/i.test(scheme)){
            response.status(401).send({error: 'Token malformatted'});
        }

        if(!process.env.ACCESS_TOKEN_SECRET){
            return;
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if(error){
                response.status(401).send({error: 'Invalid token'});
            }

            request.userId = decoded.id;
            return next();
        });
 
}
