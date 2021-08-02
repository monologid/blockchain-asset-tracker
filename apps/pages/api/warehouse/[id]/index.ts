// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Document,ObjectId} from 'mongodb'
import {DbConnection} from '@/util/database'
import { wrapHandlerError } from '@/util/error';
type Response = {
  message: string
}


export default wrapHandlerError(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|Document|undefined>
) {
   
  const { db } = await DbConnection();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      let result =  await db.collection("warehouses").findOne({_id:new ObjectId(id as string)}) || {}
      
      let summary = db.collection("warehouse_history").aggregate([
        { $match: { warehouseId: new ObjectId(id as string) }  },
        { $group: {
          _id: "$status",
          totalVolume: { $sum: "$volume" }
        }}
      ])
      console.log({summary})
      res.status(200).json(result)
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
});
