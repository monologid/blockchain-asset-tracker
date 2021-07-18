import {JwtPayload,sign,verify} from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseError } from './error';
import {DbConnection} from '@/util/database'
import { ObjectId } from 'mongodb';

const secret = process.env.JWT_SECRET || 'rahasia'

export function jwtSign(payload:object):string{
  return sign(payload, secret,{ expiresIn: '1h' });
}

export function jwtVerify(token:string): JwtPayload | string{
    return  verify(token, secret);
}


export async function authMiddleware (req: NextApiRequest, res: NextApiResponse<any> ,onlyAdminAccess:boolean=false){
  if(!req.headers['authorization']){
     throw new ResponseError("neee credential access this page",401);
  }

  const tokenParams = req.headers['authorization'].split(" ");
  const token = (tokenParams.length==1)?tokenParams[0]:tokenParams[1];

  try {
    const user = jwtVerify(token) as any;
    if(onlyAdminAccess==true && user.isAdmin==false){
      throw new ResponseError('only admin access',401); 
    }
    const {isAdmin,...userData}=user;
    if(user.admin==true){
      (req as NextApiAuthRequest).isAdmin = isAdmin;
    }else{
      const { db } = await DbConnection();
      const warehouse =  await db.collection("warehouses").findOne({_id:new ObjectId(user.warehouseId as string)});
      if(!warehouse){
        throw new ResponseError('user dont have warehouse',401); 
      }
      (req as NextApiAuthRequest).user = userData;
      (req as NextApiAuthRequest).isAdmin = isAdmin;
      (req as NextApiAuthRequest).warehouse = warehouse;
    }
  
  } catch(err) {
    throw new ResponseError(err.message||err,401); 
  }

}

export interface NextApiAuthRequest extends NextApiRequest{
  user: any;
  warehouse: any;
  isAdmin:boolean;

}