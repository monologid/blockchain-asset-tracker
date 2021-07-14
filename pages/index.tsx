import { ButtonPrimary } from "@/components/button";
import Loading from "@/components/icon/loader";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useState } from "react";
import SvgImage from "../components/svg";

export default function Home() {
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  
  const onFinish = (values: any) => {
    setIsPageLoading(true)
    router.push('/tank')
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
                <Form.Item name={`username`} style={{marginBottom: 10}}>
                  <Input placeholder={`Username`} />
                </Form.Item>

                <Form.Item name={`Password`}>
                  <Input placeholder={`Password`} />
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
