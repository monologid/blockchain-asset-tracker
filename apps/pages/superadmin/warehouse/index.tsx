import constant from "@/common/constant";
import { ButtonPrimaryLink } from "@/components/button";
import SvgImage from "@/components/svg";
import { Modal } from "antd";
import { Api } from "clients/api-client";
import { NextPageContext } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import LayoutSuperAdmin from "../_layout";
import {parseCookies} from "nookies"

export default function SuperadminWarehousePage() {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [warehouses, setWarehouses] = useState<any>([])

  const getWarehouses = async () => {
    const api = new Api({ baseUrl: constant.BaseApiUrl })
    try {
      setIsPageLoading(true)
      const result = await api.warehouse.warehouseList()
      console.dir(result.data)
      setWarehouses(result.data)
    } catch (e) {
      Modal.error({ title: 'Error', content: 'Failed to retrieve list of warehouse. Please try again later.'})
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    getWarehouses().then(null)
  }, [])

  return (
    <LayoutSuperAdmin title={`Warehouse`} isPageLoading={isPageLoading}>
      {warehouses.length == 0 &&
        <div className={`flex flex-col justify-center items-center`} style={{height: 600}}>
          <SvgImage src={`empty`} />
          
          <div className={`my-5`}>
            No warehouse has been registered.
          </div>
          
          <ButtonPrimaryLink title={`+ Create`} href={`/superadmin/warehouse/create`} />
        </div>
      }

      {warehouses.length > 0 &&
        <div className={`p-5 md:p-0 my-5`}>
          <div className={`flex justify-between items-center`}>
            <div>
              <div className={`font-bold text-primary text-xl mb-1`}>Warehouses</div>
              <div className={`text-gray-400 mb-7`}>List of registered warehouses</div>
            </div>
            <div>
              <ButtonPrimaryLink title={`+ Create`} href={`/superadmin/warehouse/create`} />
            </div>
          </div>
          {warehouses.map((item: any, i: number) => (
            <Link key={i} href={`/superadmin/warehouse/${item._id}/detail`}>
              <div className={`border rounded p-5 mb-5 cursor-pointer`}>
                <div><i className={`fa fa-desktop text-primary`} /></div>
                <div className={`text-primary font-bold text-lg mb-2`}>{item.name}</div>
                <div className={`text-sm text-gray-500`}>{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      }
    </LayoutSuperAdmin>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const cookies = parseCookies(ctx)
  if (!cookies?.superadmin_token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {}
  }
}