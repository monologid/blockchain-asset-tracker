// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {DbConnection} from '@/util/database'
import Validator, { ValidationError } from "fastest-validator";
import { Document} from 'mongodb'
import { wrapHandlerError,ResponseError } from '@/util/error';
import {verify} from '@/util/password';
import {jwtSign} from '@/util/auth';

const v = new Validator();

type Response = {
  message: string 
}

type ResponseToken = {
  token: string 
}


interface User{
  email: string
  password: string
}

const adminEmail = process.env.SUPERADMIN_EMAIL 
const adminPass = process.env.SUPERADMIN_PASSWORD 

export default wrapHandlerError(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|ResponseToken|Document[]|ValidationError[]>
) {

  const { db } = await DbConnection();

  switch (req.method) {
    case "POST":
      const schema = {
        email: { type: "email" },
        password: { type: "string", min: 6 }, 
      };

      const check = v.compile(schema);
      const user = req.body as User
      const validateResult = check(user);

      if (Array.isArray(validateResult)) {
        return res.status(400).json(validateResult)
      }

      if(user.email==adminEmail && user.password==adminPass){
        let token = jwtSign({
          isAdmin:true
        })
        return res.status(200).json({ token: token});
      }

      const result = await db.collection("users").findOne({email:user.email});
      if(!result){
        throw new ResponseError("please check again credential",400)
      }
      const verified = await verify(user.password,(result as User).password);
      if(!verified){
        throw new ResponseError("please check again credential",400)
      }
      let {password,...payload} = result as any;
      let token = jwtSign({
        isAdmin:false,
        ...payload
      })
      res.status(200).json({ token: token})
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
  
});
