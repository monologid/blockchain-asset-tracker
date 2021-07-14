// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Document,ObjectId} from 'mongodb'
import {DbConnection} from '../../../../util/database'
type Response = {
  message: string
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|Document|undefined>
) {
   
  const { db } = await DbConnection();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      let result =  await db.collection("warehouses").findOne({_id:new ObjectId(id as string)}) || {}
      res.status(200).json(result)
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
  

}
