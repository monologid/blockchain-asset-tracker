import constant from "@/common/constant";
import MainLayout from "@/components/layout/main";
import { Modal, Timeline } from "antd";
import { Api } from "clients/api-client";
import moment from "moment";
import { NextPageContext } from "next";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

export default function TankDetail({ id, isUser }: any) {
  const api = new Api({ baseUrl: constant.BaseApiUrl })
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const [tank, setTank] = useState<any>({})
  const [transactions, setTransactions] = useState<any>([])

  const getAssetDetail = async (id: string) => {
    try {
      setIsPageLoading(true)
      const result: any = await api.assets.assetsDetail(id)
      setTank(result.data.assets)
      setTransactions(result.data.transactions)
    } catch (e) {
      console.dir(e)
      Modal.error({ title: 'Error', content: 'Something went wrong when retrieving asset detail. Please try again later.'})
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    getAssetDetail(id).then(null)
  }, [])

  return (
    <MainLayout title={`Tank Detail`} isLoading={isPageLoading} isUser={isUser}>
      {tank && tank._id &&
        <div className={`p-5 md:p-0`}>
          <div className={`rounded p-5 bg-primary-color text-white my-5`}>
            <div className={`mb-2`}><i className={`fa fa-ship`} /></div>
            <div className={`text-white font-bold text-xl`}>{tank.serialNumber}</div>
            <div className={`text-white text-md`}>{tank.manufacturer}</div>
          </div>
          <div>
            <div className={`mb-5 font-bold text-primary text-xl`}>History</div>
            <Timeline>
              {transactions.map((item: any, i: number) => (
                <Timeline.Item key={i} color={item.color}>
                  {item.operation == 'CREATE' ? (
                    <>
                      <div className={`font-bold`}>{item.status}</div>
                      <div className={`grid grid-cols-12`}>
                        <div className={`col-span-1`}><i className={`fa fa-map-marker`} /></div>
                        <div className={`col-span-11 font-bold`}>Asset created</div>
                      </div>
                      <div className={`grid grid-cols-12`}>
                        <div className={`col-span-1`}><i className={`fa fa-calendar`} /></div>
                        <div className={`col-span-11`}>{moment(item.metadata.time).format('YYYY-MM-DD HH:mm:ss')}</div>
                      </div>
                    </>
                  ):(
                    <>
                      <div className={`font-bold`}>{item.status}</div>
                      <div className={`grid grid-cols-12`}>
                        <div className={`col-span-1`}><i className={`fa fa-map-marker`} /></div>
                        <div className={`col-span-11 font-bold`}>{item.metadata.warehouse.name}</div>
                      </div>
                      <div className={`grid grid-cols-12`}>
                        <div className={`col-span-1`}><i className={`fa fa-battery-three-quarters`} /></div>
                        <div className={`col-span-11`}>{item.metadata.volume} ml</div>
                      </div>
                      <div className={`grid grid-cols-12`}>
                        <div className={`col-span-1`}><i className={`fa fa-calendar`} /></div>
                        <div className={`col-span-11`}>{moment(item.metadata.time).format('YYYY-MM-DD HH:mm:ss')}</div>
                      </div>
                    </>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>
      }
    </MainLayout>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { id } = ctx.query
  const cookies = parseCookies(ctx)
  
  return {
    props: {
      id,
      isUser: cookies!.user_token ? true : false
    }
  }
}