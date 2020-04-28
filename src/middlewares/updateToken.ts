// import { User } from './../entity/User';
// import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const updateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = <string>req.headers.token;

  if (token) {
    let jwtPayload;

    // try to validate the token and get data
    try {
      jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    } catch (e) {
      return;
    }
    
    res.locals.jwtPayload = jwtPayload;
    const { id } = jwtPayload;
    // const userRepo = getRepository(User);
    // let user: User;

    // // get the user
    // try {
    //   user = await userRepo.findOneOrFail(id);
    // } catch (e) {
    //   res.status(401).send();
    // }
    // // update user lastActivity
    // // user.lastActivity = new Date();
    // user = await userRepo.save(user);

    // create new token and add it in the res header
    const newToken = jwt.sign({ id }, config.jwtSecret, {
      expiresIn: '2h',
    });
    res.setHeader('Authorization', newToken);

  }

  // call the next middleware or controller
  next();
};