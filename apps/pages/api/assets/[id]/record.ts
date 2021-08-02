// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId} from 'mongodb'
import {DbConnection} from '@/util/database'
import {BigchainInstance} from '@/util/bigchain'

import Validator, { ValidationError } from "fastest-validator";
import { ResponseError, wrapHandlerError } from '@/util/error';
import { authMiddleware, NextApiAuthRequest } from '@/util/auth';


const v = new Validator();

type Response = {
  message: string
}

export default wrapHandlerError(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|ValidationError[]>
) {

  const { db } = await DbConnection();
  const { id } = req.query;
  switch (req.method) {
    case "POST":
      
      await authMiddleware(req,res);

      const user =  (req as NextApiAuthRequest).user;
      const warehouse =  (req as NextApiAuthRequest).warehouse;
      if (!warehouse) {
        return res.status(401).json({ message: "Invalid warehouse" })
      }

      // let assets =  await db.collection("assets").findOne({_id:new ObjectId(id as string)})
      // qr will use serial number instead of asset id
      let assets =  await db.collection("assets").findOne({ serialNumber: id })
      if(!assets){
        return res.status(404).json({ message: "Record Not Found" })
      }

      const schema = {
        metadata: "object", 
      };

      const check = v.compile(schema);
      const data = req.body 
      const validateResult = check(data);

      if (Array.isArray(validateResult)) {
        return res.status(400).json(validateResult)
      }

      let keypair =  await BigchainInstance.getDefaultKeyPair();

      let transactions = await BigchainInstance.getTransactions(assets!.assetId as string)
      
      let tx =  await BigchainInstance.updateAssetRecord(transactions[transactions.length-1],{
        ...data.metadata,
        warehouse:{
          ...warehouse,
          user:{
            _id:user._id,
            fullname:user.fullname
          }
        },
        time: new Date().toISOString()
      },keypair)
      
      await db.collection("warehouse_trx_history").insertOne({
        warehouseId:warehouse._id,
        assetName: assets!.name,
        status: data.metadata.status, 
        volume: data.metadata.volume ,
        createdAt:new Date(),
        assetId: assets!.assetId,
        trxId:tx.id    
      });

      res.status(200).json({ message: "record updated" })
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
});
