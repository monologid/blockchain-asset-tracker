// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {DbConnection} from '@/util/database'
import {BigchainInstance} from '@/util/bigchain'
import Validator, { ValidationError } from "fastest-validator";
import { Document} from 'mongodb'
import { wrapHandlerError,ResponseError } from '@/util/error';
import {authMiddleware, NextApiAuthRequest} from '@/util/auth';

const v = new Validator();
type Response = {
  message: string
}

interface Asset{
  serialNumber: string
  manufacturer: string
  metadata: Record<string, any>
}



export default wrapHandlerError(async function handler(
  req:  NextApiRequest,
  res: NextApiResponse<Response|Document|ValidationError[]>
) {
    const { db } = await DbConnection();
    switch (req.method) {
      case "POST":
      await authMiddleware(req,res);
      
      const user =  (req as NextApiAuthRequest).user;
      const warehouse =  (req as NextApiAuthRequest).warehouse;
    
      const schema = {
        serialNumber: { type: "string", min: 3, max: 100 },
        manufacturer: { type: "string", min: 3, max: 100 },
        metadata: "object", 
      };

      const check = v.compile(schema);
      const asset = req.body as Asset
      const validateResult = check(asset);

      if (Array.isArray(validateResult)) {
        return res.status(400).json(validateResult)
      }

      // search asssets on offchain
      let assets =  await db.collection("assets").findOne({serialNumber:asset.serialNumber})
      if(assets){
        throw new ResponseError('serial number already exist',400);
      }
      
      // search asssets on blockhcian/onchain
      let assestBigchain = await BigchainInstance.searchAssets(asset.serialNumber);
      if(assestBigchain.length>0){
        throw new ResponseError('serial number already exist',400);
      }

      let keypair =  await BigchainInstance.getDefaultKeyPair();
      
      let assetBigchain = await BigchainInstance.createAsset({
        o2Thank:{
          serialNumber:asset.serialNumber,
          manufacturer:asset.manufacturer
        }
      },{
        ...asset.metadata,
        time: new Date().toISOString()
      }, keypair);

      await db.collection("assets").insertOne({
        serialNumber:asset.serialNumber,
        manufacturer:asset.serialNumber,
        assetId:assetBigchain.id,
        owner : keypair.publicKey
      })

      res.status(200).json({ message: "assets created" })
      break;
    case "GET":
      let results =  await db.collection("assets").find({}).toArray()
      res.status(200).json(results)
      break;
    default:
      res.status(404).json({ message: "Request HTTP Method Incorrect." })
      break;
  }

});
