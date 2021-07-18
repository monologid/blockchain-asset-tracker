// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {DbConnection} from '@/util/database'
import {BigchainInstance} from '@/util/bigchain'
import Validator, { ValidationError } from "fastest-validator";
import { Document} from 'mongodb'
import { wrapHandlerError } from '@/util/error';
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

      let keypair =  await BigchainInstance.getDefaultKeyPair();
      
      let assetBigchain = await BigchainInstance.createAsset({
        o2Thank:{
          serialNumber:asset.serialNumber,
          manufacturer:asset.manufacturer
        }
      },{
        ...asset.metadata,
        warehouse:{
          ...warehouse,
          user:{
            _id:user._id,
            fullname:user.fullname
          }
        },
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
