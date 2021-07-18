import constant from "@/common/constant";
import { ButtonPrimary } from "@/components/button";
import Loading from "@/components/icon/loader";
import { Button, Form, Input } from "antd";
import { Api } from "clients/api-client";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import SvgImage from "../components/svg";
import jwt from "jsonwebtoken";
import { NextPageContext } from "next";
import { parseCookies } from 'nookies';

export default function Home() {
  const router = useRouter()
  const api = new Api({ baseUrl: constant.BaseApiUrl })
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  
  const onFinish = async (values: any) => {
    try {
      setIsPageLoading(true)
      const result = await api.auth.authCreate(values)
      const data: any = result.data
      const { isAdmin }: any = jwt.decode(data.token)
      if (isAdmin) {
        router.push('/superadmin/warehouse')
      } else {
        router.push('/tank')
      }
    } catch (e) {
      setIsPageLoading(false)
    }
  }

  const onClickSignInAsGuest = () => {
    setIsPageLoading(true)
    router.push('/tank')
  }

  if (isPageLoading) {
    return (
      <div className={`h-screen flex justify-center items-center`}>
        <Loading />
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Blockchain Tracker</title>
      </Head>

      <main>
        <div className={`h-screen flex justify-center items-center`}>
          <div className={`w-4/6 md:w-3/12`}>
            <div><SvgImage src={`hello`} /></div>
            <div className={`font-bold uppercase mb-5 text-center`}>Blockchain Tracker</div>
            <div className={`mb-2`}>
              <Form onFinish={onFinish}>
                <Form.Item name={`email`} style={{marginBottom: 10}}>
                  <Input placeholder={`Email`} />
                </Form.Item>

                <Form.Item name={`password`}>
                  <Input.Password placeholder={`Password`} />
                </Form.Item>

                <ButtonPrimary title={`Sign In`} className={`w-full font-semibold`} />
              </Form>
            </div>
            <div>
              <div className={`my-3 text-center`}>OR</div>
              <Button style={{width: '100%'}} onClick={onClickSignInAsGuest}>Sign In as Guest</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const cookies = parseCookies(ctx)
  if (cookies!.superadmin_token) {
    return {
      redirect: {
        destination: '/superadmin/warehouse',
        permanent: false,
      },
    }
  }

  if (cookies!.user_token) {
    return {
      redirect: {
        destination: '/tank',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}