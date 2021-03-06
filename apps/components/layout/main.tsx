import {FC, useState} from "react";
import Head from "next/head";
import Loading from "../icon/loader";
import Scanner from "@/components/scanner";
import { Button, Drawer, Form, Input, InputNumber, Select } from "antd";
import Link from "next/link";
import {Modal} from "antd";
import { Api } from "clients/api-client";
import constant from "@/common/constant";

interface IMainLayoutProps {
  readonly title: string
  readonly isLoading: boolean
  readonly isUser?: boolean
}

const MainLayout: FC<IMainLayoutProps> = ({ title, isLoading = false, isUser = false, children }) => {
  const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [isShowScanner, setIsShowScanner] = useState<boolean>(false)

  const [qrData, setQrData] = useState<string | null>(null)
  const [isShowModalAssetRecord, setIsShowModalAssetRecord] = useState<boolean>(false)
  const [formAsset] = Form.useForm()
  const onQRScan = (data: any) => {
    if (data) {
      setIsShowScanner(false)
      setQrData(data)
      setIsShowModalAssetRecord(true)
      formAsset.setFieldsValue({ asset: data })
    }
  }

  const onQRError = (err: any) => {
    console.dir(err)
    Modal.error({ title: 'Error', content: err })
  }

  const onFinishFormAsset = async (values: any) => {
    const { status, volume, flag } = values
    setIsShowModalAssetRecord(false)
    setIsPageLoading(true)
    
    try {
      const api = new Api({ baseUrl: constant.BaseApiUrl })
      await api.assets.recordCreate(values.asset, { metadata: { status, volume, flag } })
      window.location.reload()
    } catch (e) {
      Modal.error({ title: 'Error', content: `Failed to submit new record for asset ${values.asset}` })
      formAsset.resetFields()
      setIsPageLoading(false)
    }
  }

  return (
    <div>
      <Head>{title}</Head>

      <main>
        { (isLoading || isPageLoading) ? (
          <div className={`w-full h-screen flex justify-center items-center`}>
            <Loading />
          </div>
        ): (
          <>
            <div className={`w-full flex justify-between items-center bg-primary-color text-white p-5`}>
              <div className={`font-bold uppercase`}>Blockchain Tracker</div>
              <div>
                <i className={`fa fa-bars cursor-pointer`} onClick={e => setIsShowDrawer(true)}/>
              </div>
            </div>
            <div className={`container-mobile mx-auto`}>
              {!isShowScanner && children}

              <Scanner
                onQRError={onQRError}
                onQRScan={onQRScan}
                isShow={isShowScanner}
                setIsShow={setIsShowScanner} />

              {!isShowScanner && isUser &&
                <div className={`fixed bottom-0 right-0 p-8`}>
                  <button
                    className={`bg-primary-color font-bold text-white uppercase h-16 w-16 flex items-center justify-center rounded-full`}
                    onClick={e => setIsShowScanner(true)}>Scan</button>
                </div>
              }
            </div>
          </>
        )}
      </main>

      <Drawer visible={isShowDrawer} onClose={e => setIsShowDrawer(false)}>
        <div className={`pt-10`}>
          <MenuItem title={`Assets`} href={`/tank`} />
          <MenuItem title={`Log Out`} href={`/api/logout`} />
        </div>
      </Drawer>

      <Modal title={`Scan Asset`} visible={isShowModalAssetRecord} onCancel={e => setIsShowModalAssetRecord(false)} footer={null}>
        <Form form={formAsset} onFinish={onFinishFormAsset} layout={`vertical`}>
          <Form.Item label={`Asset`} name={`asset`} required>
            <Input disabled />
          </Form.Item>

          <Form.Item label={`Status`} name={`status`} required>
            <Select>
              <Select.Option value={`IN`}>IN</Select.Option>
              <Select.Option value={`OUT`}>OUT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label={`Flag`} name={`flag`} required>
            <Select>
              {['READY', 'IN-TRANSIT', 'TO BE REPAIRED', 'TO BE REFILLED', 'INACTIVE'].map((item: string, i: number) => (
                <Select.Option key={i} value={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={`Volume`} name={`volume`} required>
            <InputNumber />
          </Form.Item>

          <div className={`flex justify-end items-center`}>
            <Button type={`primary`} htmlType={`submit`}>Submit</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

const MenuItem = ({ title, href }: any) => (
  <Link href={href}>
    <div className={`cursor-pointer mb-2`}>{title}</div>
  </Link>
)

export default MainLayout