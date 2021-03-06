// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {DbConnection} from '@/util/database'
import Validator, { ValidationError } from "fastest-validator";
import { Document} from 'mongodb'
import {wrapHandlerError} from '@/util/error';
import { authMiddleware } from '@/util/auth';

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
      await authMiddleware(req,res,true);
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
      let results: any = await db.collection("warehouses").aggregate([
        {
          $lookup: {
            from: "warehouse_trx_history",
            localField: "_id",
            foreignField: "warehouseId",
            as: "warehouse_trx_history"
          }
        }
      ]).toArray();

      results.map((item: any) => {
        let totalIn: number = 0
        let totalOut: number = 0
        item.warehouse_trx_history.forEach((trx: any) => {
          if (trx.status == 'IN') totalIn = totalIn + trx.volume
          if (trx.status == 'OUT') totalOut = totalOut + trx.volume
        })

        item.summary = {
          totalIn, totalOut
        }
      })

      res.status(200).json(results)
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
  
});
