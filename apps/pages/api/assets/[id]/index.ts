// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Document,ObjectId} from 'mongodb'
import {DbConnection} from '@/util/database'
import {BigchainInstance} from '@/util/bigchain'
import { wrapHandlerError } from '@/util/error'

type Response = {
  message: string
}
export default wrapHandlerError(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|Document|undefined>
) {

  const { db } = await DbConnection();
  const { id } = req.query;

  let assets =  await db.collection("assets").findOne({_id:new ObjectId(id as string)})
  if(!assets){
    return res.status(200).json({})
  }

  let summary = await db.collection("warehouse_history").aggregate([
    { $match: { assetId: assets!.assetId }  },
    { $group: {
      _id: "$status",
      totalVolume: { $sum: "$volume" }
    }}
  ]).toArray();


  let transactions = await BigchainInstance.getTransactions(assets!.assetId as string)
  
  res.status(200).json({
    assets:assets,
    transactions:transactions,
    summary:summary
  })

});
