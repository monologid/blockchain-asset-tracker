// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {DbConnection} from '@/util/database'
import Validator, { ValidationError } from "fastest-validator";
import { Document} from 'mongodb'
import {wrapHandlerError} from '@/util/error';

const v = new Validator();

type Response = {
  message: string
}

interface Warehosue{
  name: string
  description: string
  latitude: string
  longitude: string
}


export default wrapHandlerError(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|Document[]|ValidationError[]>
) {

  const { db } = await DbConnection();

  switch (req.method) {
    case "POST":
      const schema = {
        name: { type: "string", min: 3, max: 100 },
        description: { type: "string", min: 10, max: 255 },
        latitude: "string", 
        longitude: "string" 
      };

      const check = v.compile(schema);
      const warehosue = req.body as Warehosue
      const validateResult = check(warehosue);

      if (Array.isArray(validateResult)) {
        return res.status(400).json(validateResult)
      }

      await db.collection("warehouses").insertOne(warehosue)
      res.status(200).json({ message: 'success create warehouse '})
      break;
    case "GET":
      let results =  await db.collection("warehouses").find({}).toArray()
      res.status(200).json(results)
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
  
});
