import { NextApiRequest, NextApiResponse } from "next";
import { setCookie, destroyCookie } from "nookies";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const opts = {
      maxAge: 0,
      path: '/',
    }
    setCookie({ res }, 'superadmin_token', '', opts)
    setCookie({ res }, 'user_token', '', opts)
    destroyCookie({ res }, 'superadmin_token', {})
    destroyCookie({ res }, 'user_token', {})
    console.dir('ok')
  } catch (e) {
    console.dir('not ok')
    console.dir(e)
  }

  res.redirect('/')
}