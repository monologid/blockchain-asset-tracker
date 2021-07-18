import constant from "@/common/constant";
import { ButtonPrimaryLink } from "@/components/button";
import SvgImage from "@/components/svg";
import { Button, Divider, Form, Input, Modal } from "antd";
import { Api } from "clients/api-client";
import moment from "moment";
import { NextPageContext } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import LayoutSuperAdmin from "../_layout";
import { parseCookies } from "nookies"

export default function SuperadminAssetPage() {
  const api = new Api({ baseUrl: constant.BaseApiUrl })
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false)
  const [assets, setAssets] = useState<any>([])

  const getAssets = async () => {
    try {
      setIsPageLoading(true)
      const result = await api.assets.assetsList()
      setAssets(result.data)
    } catch (e) {
      Modal.error({ title: 'Error', content: 'Something went wrong, please try again later.' })
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    getAssets().then(null)
  }, [])

  const [formCreateAsset] = Form.useForm()
  const onFinish = async (values: any) => {
    const data: any = { ...values, metadata: { createdAt: moment().format('YYYY-MM-DD HH:mm:ss')}}

    try {
      setIsPageLoading(true)
      await api.assets.assetsCreate(data)
      window.location.reload()
    } catch (e) {
      Modal.error({ title: 'Error', content: `Something went wrong when creating new asset. Error: ${e!.error!.error}`})
      setIsPageLoading(false)
    }
  }

  return (
    <LayoutSuperAdmin title={`Warehouse`} isPageLoading={isPageLoading}>
      {assets.length == 0 &&
        <div className={`flex flex-col justify-center items-center`} style={{height: 600}}>
          <SvgImage src={`empty`} />
          
          <div className={`my-5`}>
            No asset has been registered.
          </div>
          
          <Button type={`primary`} onClick={e => {
            formCreateAsset.resetFields()
            setIsShowModalCreate(true)
          }}>+ Create</Button>
        </div>
      }

      {assets.length && assets.length > 0 &&
        <div className={`p-5 md:p-0 my-5`}>
          <div className={`flex justify-between items-center`}>
            <div>
              <div className={`font-bold text-primary text-xl mb-1`}>Assets</div>
              <div className={`text-gray-400 mb-7`}>List of registered assets</div>
            </div>
            <div>
              <Button type={`primary`} onClick={e => {
                formCreateAsset.resetFields()
                setIsShowModalCreate(true)
              }}>+ Create</Button>
            </div>
          </div>
          {assets.map((item: any, i: number) => (
            <div key={i} className={`border rounded p-5 mb-5 cursor-pointer`}>
              <div><i className={`fa fa-desktop text-primary`} /></div>
              <div className={`text-primary font-bold text-lg mb-2`}>{item.serialNumber}</div>
              <div className={`text-sm text-gray-500`}>{item.manufacturer}</div>
              <div className={`flex justify-end items-center mt-5`}>
                <div className={`mr-5`}>
                  <a href={`/tank/${item._id}`} target={`_blank`}>View Detail</a>
                </div>
                <div>
                  <a href={`/superadmin/asset/${item.serialNumber}/qr`} target={`_blank`}>Generate QR Code</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      }

      <Modal visible={isShowModalCreate} title={`Create an asset`} footer={null} onCancel={e => setIsShowModalCreate(false)}>
        <Form form={formCreateAsset} onFinish={onFinish} layout={`vertical`}>
          <Form.Item label={`Serial Number`} name={`serialNumber`} rules={[{required: true}]} required>
            <Input />
          </Form.Item>
          <Form.Item label={`Manufacturer`} name={`manufacturer`} rules={[{required: true}]} required>
            <Input />
          </Form.Item>
          
          <div className={`flex justify-end`}>
            <Button type={`primary`} htmlType={`submit`}>Submit</Button>
          </div>
        </Form>
      </Modal>
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