import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';

class UserController {
  static create = async (req: Request, res: Response) => {
    const { email, password, pseudo } = req.body;
    const user = new User();
    user.email = email;
    user.password = password;
    user.pseudo = pseudo;
    const userRepository = getRepository(User);
    const errors = await validate(user.email, user.password);

    // check user is valid
    if (errors.length > 0) {
      res.status(400).json({ error: errors });
      return;
    }

    // hash the password before persisting in database
    user.hashPassword();

    // save the user
    try {
      await userRepository.save(user);
      res.status(201).send();
    } catch (e) {
      res.status(400).json({ error: 'username already in use' });
    }
  }

  static getCurrentUser = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload;
    if (!id) {
      res.status(401).json({ error: id });
      return;
    }
;
    const userRepo = getRepository(User);
    let user: User;

    try {
      user = await userRepo.findOneOrFail(id);
    } catch (e) {
      res.status(401).json({ error: 'invalid jwt' });
      return;
    }

    res.status(200).json(user);
  }
}

export default UserController;