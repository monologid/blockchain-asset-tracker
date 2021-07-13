import { ButtonPrimary } from "@/components/button";
import { Form, Input, Select } from "antd";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import LayoutSuperAdmin from "../_layout";

export default function SuperadminWarehouseCreatePage() {
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [users, setUsers] = useState<Array<any>>([])

  const onFinish = async (values: any) => {
    setIsPageLoading(true)
    console.dir(values)
    router.push('/superadmin/warehouse')
  }

  useEffect(() => {
    // TODO: call to api to retrieve users
    setUsers([
      {
        email: 'tony@avengers.com',
        fullname: 'Tony'
      },
      {
        email: 'thor@avengers.com',
        fullname: 'Thor'
      },
      {
        email: 'loki@avengers.com',
        fullname: 'Loki'
      },
    ])
  }, [])
  
  return (
    <LayoutSuperAdmin title={`Warehouse | Create`} isPageLoading={isPageLoading}>
      <div className={`p-5`}>
        <div className={`text-primary text-lg font-bold mb-5`}>Create a new Warehouse</div>
        <Form onFinish={onFinish} layout={`vertical`}>
          <Form.Item label={`Name`} name={`name`} rules={[{required:true}]} required>
            <Input />
          </Form.Item>

          <Form.Item label={`Users`} name={`users`} rules={[{required:true}]} required>
            <Select mode={`multiple`} showSearch>
              {users.map((item, i) => (
                <Select.Option key={i} value={item.email}>{item.fullname}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className={`flex justify-end`}>
            <ButtonPrimary title={`Submit`} />
          </div>
        </Form>
      </div>
    </LayoutSuperAdmin>
  )
}