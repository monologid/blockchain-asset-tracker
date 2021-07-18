import { NextApiRequest, NextApiResponse } from "next";


export function wrapHandlerError(handler: (req: NextApiRequest, res: NextApiResponse<any>) => Promise<any>) {
    return async ( req: NextApiRequest, res:NextApiResponse) => {
      return handler(req, res)
        .catch((error:any) => { 
          // error from bigchaindb
          if(error.status && error.requestURI){
            const status =error.status.split(" ")[0]||500;
            return res.status(status).send({
              error:error.message || error,
              requestURI:error.requestURI
            });
          }
          return res.status(500).send({error:error.message || error});
        });
    }
  }