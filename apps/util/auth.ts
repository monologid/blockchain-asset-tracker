import {JwtPayload,sign,verify} from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseError } from './error';
const secret ='rahasia';

export function jwtSign(payload:object):string{
  return sign(payload, secret,{ expiresIn: '1h' });
}

export function jwtVerify(token:string): JwtPayload | string{
    return  verify(token, secret);
}


export async function authMiddleware (req: NextApiRequest, res: NextApiResponse<any>){
  if(!req.headers['authorization']){
     throw new ResponseError("neee credential access this page",401);
  }

  const tokenParams = req.headers['authorization'].split(" ");
  const token = (tokenParams.length==1)?tokenParams[0]:tokenParams[1];

  try {
    const decoded = jwtVerify(token);
    (req as NextApiAuthRequest).user = decoded;
  } catch(err) {
    throw new ResponseError(err.message||err,401); 
  }

}

export interface NextApiAuthRequest extends NextApiRequest{
  user: any;

}