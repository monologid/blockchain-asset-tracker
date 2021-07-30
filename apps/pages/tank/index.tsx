import SvgImage from "components/svg";
import MainLayout from "components/layout/main";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Api } from "clients/api-client";
import constant from "@/common/constant";
import { Modal } from "antd";
import { NextPageContext } from "next";
import { parseCookies } from 'nookies'

export default function Dashboard({ isUser }: any) {
  const api = new Api({ baseUrl: constant.BaseApiUrl })
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [assets, setAssets] = useState<any>([])

  const getAssets = async () => {
    try {
      setIsPageLoading(true)
      const result = await api.assets.assetsList()
      setAssets(result.data)
    } catch (e) {
      Modal.error({ title: 'Error', content: 'Something went wrong when retrieving assets. Please try again later.'})
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    getAssets().then(null)
  }, [])

  return (
    <MainLayout title={`Home`} isLoading={isPageLoading} isUser={isUser}>
      {assets.length == 0 &&
        <div className={`flex flex-col justify-center items-center`} style={{height: 600}}>
          <SvgImage src={`empty`} />
          <br/>
          No asset has been registered.
        </div>
      }

      {assets.length > 0 &&
        <div className={`p-5 md:p-0 my-5`}>
          <div className={`font-bold text-primary text-xl mb-1`}>Tanks</div>
          <div className={`text-gray-400 mb-7`}>List of registered tanks</div>
          {assets.map((item: any, i: number) => (
            <Link key={i} href={`/tank/${item._id}`}>
              <div className={`border rounded p-5 mb-5 cursor-pointer`}>
                <div><i className={`fa fa-ship text-primary`} /></div>
                <div className={`text-primary font-bold text-lg`}>{item.serialNumber}</div>
              </div>
            </Link>
          ))}
        </div>
      }
    </MainLayout>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const cookies = parseCookies(ctx)

  return {
    props: {
      isUser: cookies!.user_token ? true : false
    }
  }
}