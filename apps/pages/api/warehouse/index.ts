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
      let results =  await db.collection("warehouses").find({}).toArray()
      let summaries = await db.collection("warehouse_trx_history").aggregate([
        { $group: {
          _id: {
            warehouseId:"$warehouseId",
            status:"$status"
          },
          totalVolume: { $sum: "$volume" }
        }}
      ]).toArray();
      results.map(item=>{
        let summary = summaries.filter( (e)=> {
          return e._id.warehouseId =item._id;
        });
        item['summary']=summary;
      })
  

      res.status(200).json(results)
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
  
});
