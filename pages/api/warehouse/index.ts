// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

//import {BigchainInstance} from '../../../util/bigchain'


// import {DbConnection} from '../../../util/database'

import Validator, { ValidationError } from "fastest-validator";

const v = new Validator();

type Data = {
  name: string
}

interface Warehosue{
  name: string
  description: string
  latitude: string
  longitude: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data|ValidationError[]>
) {

  if (req.method === 'POST') {

    const schema = {
      name: { type: "string", min: 3, max: 100 },
      description: { type: "string", min: 10, max: 255 },
      latitude: "string", 
      longitude: "string" 
    };

    const check = v.compile(schema);
    const warehosue = req.body as Warehosue
    const result = check(warehosue);

    if (Array.isArray(result)) {
      return res.status(400).json(result)
    }
   
    return res.status(200).json({ name: 'create '})
  } else {
   return  res.status(200).json({ name: 'get'})
  } 
  
}
