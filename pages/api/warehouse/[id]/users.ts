// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {DbConnection} from '../../../../util/database'
import Validator, { ValidationError } from "fastest-validator";
import { Document} from 'mongodb'

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


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|Document[]|ValidationError[]>
) {

  const { db } = await DbConnection();
  const { id } = req.query;
  switch (req.method) {
    case "POST":
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

      await db.collection("users").insertOne({...user,warehouseId:id})
      res.status(200).json({ message: 'success create new user '})
      break;
    case "GET":
      let results =  await db.collection("users").find({warehouseId:id}).toArray()
      res.status(200).json(results)
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
  
}
