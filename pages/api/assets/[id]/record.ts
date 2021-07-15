// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId} from 'mongodb'
import {DbConnection} from '../../../../util/database'
import {BigchainInstance} from '../../../../util/bigchain'

import Validator, { ValidationError } from "fastest-validator";

const v = new Validator();

type Response = {
  message: string
}

const passphrase = 'This is a random passphrase'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response|ValidationError[]>
) {

  const { db } = await DbConnection();
  const { id } = req.query;
  switch (req.method) {
    case "POST":
      let assets =  await db.collection("assets").findOne({_id:new ObjectId(id as string)})
      if(!assets){
        res.status(404).json({ message: "Record Not Found" })
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

      let keypair =  await BigchainInstance.generateKeyPairFormPassphrase(passphrase);

      let transactions = await BigchainInstance.getTransactions(assets!.assetId as string)
      
      await BigchainInstance.updateAssetRecord(transactions[transactions.length-1],data.metadata,keypair)
      
      res.status(200).json({ message: "record updated" })
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }
}