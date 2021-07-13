import { ButtonPrimary } from "@/components/button";
import { Form, Input } from "antd";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import LayoutSuperAdmin from "../_layout";

export default function SuperadminWarehouseCreatePage() {
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)

  const onFinish = async (values: any) => {
    setIsPageLoading(true)
    console.dir(values)
    router.push('/superadmin/user')
  }

  return (
    <LayoutSuperAdmin title={`User Management | Create`} isPageLoading={isPageLoading}>
      <div className={`p-5`}>
        <div className={`text-primary text-lg font-bold mb-5`}>Register a new User</div>
        <Form onFinish={onFinish} layout={`vertical`}>
          <Form.Item label={`Full Name`} name={`fullname`} rules={[{required:true}]} required>
            <Input />
          </Form.Item>

          <Form.Item label={`Email`} name={`email`} rules={[{required:true}]} required>
            <Input />
          </Form.Item>

          <Form.Item label={`Password`} name={`password`} rules={[{required:true}]} required>
            <Input.Password />
          </Form.Item>

          <Form.Item label={`Phone No`} name={`phone_no`} rules={[{required:true}]} required>
            <Input />
          </Form.Item>

          <div className={`flex justify-end`}>
            <ButtonPrimary title={`Submit`} />
          </div>
        </Form>
      </div>
    </LayoutSuperAdmin>
  )
}