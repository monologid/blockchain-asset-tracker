import { ButtonPrimary } from "@/components/button";
import { Form, Input, Modal, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Api } from "clients/api-client";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import LayoutSuperAdmin from "../_layout";
import constant from "common/constant"
import { NextPageContext } from "next";
import { parseCookies } from "nookies";

export default function SuperadminWarehouseCreatePage() {
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const onFinish = async (values: any) => {
    const api = new Api({ baseUrl: constant.BaseApiUrl })
    try {
      setIsPageLoading(true)
      await api.warehouse.warehouseCreate(values)
      router.push('/superadmin/warehouse')
    } catch (e) {
      setIsPageLoading(false)
      form.setFieldsValue(values)
      Modal.error({ title: 'Error', content: 'Something went wrong when creating new warehouse. Please try again later.'})
    }
  }

  return (
    <LayoutSuperAdmin title={`Warehouse | Create`} isPageLoading={isPageLoading}>
      <div className={`text-primary text-lg font-bold mb-5`}>Create a new Warehouse</div>
      <Form form={form} onFinish={onFinish} layout={`vertical`}>
        <Form.Item label={`Name`} name={`name`} rules={[{required:true}]} required>
          <Input />
        </Form.Item>

        <Form.Item label={`Description`} name={`description`} rules={[{required:false}]}>
          <TextArea />
        </Form.Item>

        <Form.Item label={`Latitude`} name={`latitude`} rules={[{required:true}]} required>
          <Input />
        </Form.Item>

        <Form.Item label={`Longitude`} name={`longitude`} rules={[{required:true}]} required>
          <Input />
        </Form.Item>

        <div className={`flex justify-end`}>
          <ButtonPrimary title={`Submit`} />
        </div>
      </Form>
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