// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {DbConnection} from '@/util/database'
import Validator, { ValidationError } from "fastest-validator";
import { Document} from 'mongodb'
import { wrapHandlerError,ResponseError } from '@/util/error';
import {hash} from '@/util/password';
import { authMiddleware } from '@/util/auth';

const v = new Validator();

type Response = {
  message: string
}

interface User{
  fullname: string
  email: string
  password: string
  phoneNo: string
}

export default wrapHandlerError(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|Document[]|ValidationError[]>
) {

  const { db } = await DbConnection();
  const { id } = req.query;
  switch (req.method) {
    case "POST":
      await authMiddleware(req,res,true);

      const schema = {
        fullname: { type: "string", min: 3, max: 100 },
        email: { type: "email" },
        password: { type: "string", min: 6 }, 
        phoneNo: "string" 
      };

      const check = v.compile(schema);
      const user = req.body as User
      const validateResult = check(user);

      if (Array.isArray(validateResult)) {
        return res.status(400).json(validateResult)
      }

      const result = await db.collection("users").findOne({email:user.email});
      if(result){
        throw new ResponseError ("email already exist",400);
      }

      user.password = await hash(user.password);
      await db.collection("users").insertOne({...user,warehouseId:id})
      res.status(200).json({ message: 'success create new user '})
      break;
    case "GET":
      await authMiddleware(req,res,true);

      let results =  await db.collection("users").find({warehouseId:id}).toArray()
      res.status(200).json(results)
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
  
});
