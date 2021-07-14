import MainLayout from "@/components/layout/main";
import { Timeline } from "antd";
import moment from "moment";
import { NextPageContext } from "next";
import { useState } from "react";

export default function TankDetail({ id }: any) {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [tank, setTank] = useState<any>({
    id,
    status: 'Shipping',
    location: 'Bandung',
    history: [
      {
        color: 'green',
        status: 'IN',
        tankage: 2250,
        location: 'Port',
        createdAt: moment().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        color: 'green',
        status: 'IN',
        tankage: 250,
        location: 'Jakarta',
        createdAt: moment().format('DD-MM-YYYY HH:mm:ss')
      },
      {
        color: 'red',
        status: 'OUT',
        tankage: 210,
        
        location: 'Bandung',
        createdAt: moment().format('DD-MM-YYYY HH:mm:ss')
      }
    ]
  })

  return (
    <MainLayout title={`Tank Detail`} isLoading={isPageLoading}>
      <div className={`p-5 md:p-0`}>
        <div className={`rounded p-5 bg-primary-color text-white my-5`}>
          <div className={`mb-2`}><i className={`fa fa-ship`} /></div>
          <div className={`text-white font-bold text-xl`}>{tank.id}</div>
        </div>
        <div>
          <div className={`mb-5 font-bold text-primary text-xl`}>History</div>
          <Timeline>
            {tank.history.map((item: any, i: number) => (
              <Timeline.Item key={i} color={item.color}>
                <div className={`font-bold`}>{item.status}</div>
                <div className={`grid grid-cols-12`}>
                  <div className={`col-span-1`}><i className={`fa fa-map-marker`} /></div>
                  <div className={`col-span-11`}>{item.location}</div>
                </div>
                <div className={`grid grid-cols-12`}>
                  <div className={`col-span-1`}><i className={`fa fa-battery-three-quarters`} /></div>
                  <div className={`col-span-11`}>{item.tankage} ml</div>
                </div>
                <div className={`grid grid-cols-12`}>
                  <div className={`col-span-1`}><i className={`fa fa-calendar`} /></div>
                  <div className={`col-span-11`}>{item.createdAt}</div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
    </MainLayout>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { id } = ctx.query
  return {
    props: {
      id
    }
  }
}