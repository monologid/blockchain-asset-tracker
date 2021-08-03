import constant from "@/common/constant";
import { Modal, Table } from "antd";
import { Api } from "clients/api-client";
import moment from "moment";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import LayoutSuperAdmin from "pages/superadmin/_layout";
import { useEffect, useState } from "react";

export default function WarehouseReport({ id }: any) {
  const api = new Api({ baseUrl: constant.BaseApiUrl })
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  
  const [warehouse, setWarehouse] = useState<any>({})
  const [summary, setSummary] = useState<Array<any>>([])
  const [history, setHistory] = useState<Array<any>>([])
  const getWarehouseDetail = async (id: any) => {
    setIsPageLoading(true)
    try {
      const result: any = await api.warehouse.warehouseDetail(id)
      setWarehouse(result.data)
      setSummary(result.data?.summary || [])
      setHistory(result.data?.history || [])
    } catch (e) {
      Modal.error({ title: 'Error', content: 'Failed to retrieve report'})
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    getWarehouseDetail(id)
  }, [])

  return (
    <LayoutSuperAdmin title={`Warehouse Report Detail`} isPageLoading={isPageLoading}>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-5`}>
        <div className={`border rounded p-5 mb-5 cursor-pointer`}>
          <div><i className={`fa fa-desktop text-primary`} /></div>
          <div className={`text-primary font-bold text-lg mb-2`}>{warehouse.name || 'Uknown warehouse'}</div>
          <div className={`text-sm text-gray-500`}>{warehouse.description}</div>
          <div className={`text-sm text-gray-500`}>{warehouse.latitude || 0}, {warehouse.longitude || 0}</div>
        </div>
        {summary.map((item: any, i: number) => (
          <div key={i} className={`border rounded p-5 mb-5 cursor-pointer flex flex-col justify-between`}>
            <div>Total Volume - {item._id}</div>
            <div className={`text-right font-bold text-4xl`}>{item.totalVolume.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {history.length > 0 &&
        <Table dataSource={history} columns={[
          { key: 'asset', dataIndex: 'asset', title: 'Asset Serial Number', 
          // eslint-disable-next-line react/display-name
          render: (item: any) => <>{item[0].serialNumber || 'N/A'}</> },
          { key: 'status', dataIndex: 'status', title: 'Status', 
          // eslint-disable-next-line react/display-name
          render: (item: any) => (item.toLowerCase() === 'out') ? <span className={`text-red-500 font-bold`}>{item}</span> : <span className={`text-green-600 font-bold`}>{item}</span> },
          { key: 'volume', dataIndex: 'volume', title: 'Volume' },
          { key: 'createdAt', dataIndex: 'createdAt', title: 'Created At', 
          // eslint-disable-next-line react/display-name
          render: (item: any) => moment(item).format('DD-MM-YYYY HH:mm:ss') }
        ]} />
      }
    </LayoutSuperAdmin>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { id } = ctx.query
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
    props: {
      id
    }
  }
}