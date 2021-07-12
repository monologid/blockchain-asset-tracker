// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import {BigchainInstance} from '../../util/bigchain'
type Data = {
  name: string
}



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let keypair = BigchainInstance.generateKeyPair()
  console.log({keypair})
  res.status(200).json({ name: 'John Doe'})
  
}
