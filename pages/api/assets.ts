// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import {BigchainInstance} from '../../util/bigchain'
type Data = {
  name: string
}

import {DbConnection} from '../../util/database'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { db } = await DbConnection();


  res.status(200).json({ name: 'John Doe'})
  
}
