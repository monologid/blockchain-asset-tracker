import { NextApiRequest, NextApiResponse } from "next";


export function wrapHandlerError(handler: (req: NextApiRequest, res: NextApiResponse<any>) => Promise<any>) {
    return async ( req: NextApiRequest, res:NextApiResponse) => {
      return handler(req, res)
        .catch((error:Error) => {
          console.error(error);
          return res.status(500).send({error:error.message || error});
        });
    }
  }