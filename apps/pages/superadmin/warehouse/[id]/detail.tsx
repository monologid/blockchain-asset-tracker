import constant from "@/common/constant"
import SvgImage from "@/components/svg"
import { ConsoleSqlOutlined } from "@ant-design/icons"
import { Alert, Button, Form, Input, Modal } from "antd"
import { Api } from "clients/api-client"
import { NextPageContext } from "next"
import LayoutSuperAdmin from "pages/superadmin/_layout"
import { useEffect, useState } from "react"

export default function WarehouseDetailPage({ id }: any) {
  const api = new Api({ baseUrl: constant.BaseApiUrl })
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [isShowModalCreateUser, setIsShowModalCreateUser] = useState<boolean>(false)
  const [warehouse, setWarehouse] = useState<any>({})
  const [users, setUsers] = useState<any>([])
  const [errors, setErrors] = useState<any>([])

  const [formCreateUser] = Form.useForm()
  
  const getWarehouseDetail = async (id: string) => {
    try {
      setIsPageLoading(true)
      const result = await api.warehouse.warehouseDetail(id)
      setWarehouse(result.data)
      await getWarehouseUsers(id)
    } catch (e) {
      setIsPageLoading(false)
      Modal.error({ title: 'Error', content: 'Failed to retrieve list of warehouse. Please try again later.'})
    }
  }

  const getWarehouseUsers = async (id: string) => {
    try {
      setIsPageLoading(true)
      const result = await api.warehouse.usersDetail(id)
      setUsers(result.data)
    } catch (e) {
      Modal.error({ title: 'Error', content: 'Failed to retrieve list of warehouse. Please try again later.'})
    } finally {
      setIsPageLoading(false)
    }
  }

  const onFinishCreateUser = async (values: any) => {
    try {
      setIsPageLoading(true)
      await api.warehouse.usersCreate(id, values)
      window.location.reload()
    } catch (e) {
      setIsPageLoading(false)
      Modal.error({ title: 'Error', content: 'Failed to create new user.'})
      setErrors(e.error)
    }
  }

  useEffect(() => {
    getWarehouseDetail(id).then(null)
  }, [])

  return (
    <LayoutSuperAdmin title={`Warehouse Detail`} isPageLoading={isPageLoading}>
      {!isPageLoading &&
        <div className={`p-5`}>
          <div className={`border rounded p-5 mb-5 cursor-pointer`}>
            <div><i className={`fa fa-desktop text-primary`} /></div>
            <div className={`text-primary font-bold text-lg mb-2`}>{warehouse.name || 'Uknown warehouse'}</div>
            <div className={`text-sm text-gray-500`}>{warehouse.description}</div>
            <div className={`text-sm text-gray-500`}>{warehouse.latitude || 0}, {warehouse.longitude || 0}</div>
          </div>

          <div className={`flex justify-between items-center`}>
            <div className={`font-bold text-primary text-xl mb-3`}>Users</div>
            <div><Button type={`primary`} onClick={e => setIsShowModalCreateUser(true)}>Create</Button></div>
          </div>
          {users.length == 0 && 
            <div className={`flex flex-col justify-center items-center`}>
              <SvgImage src={`empty`} />
              No users have been assigned into this warehouse.
            </div>
          }
          {users.length > 0 &&
            <div>
              {users.map((item: any, i: number) => (
                <div key={i} className={`border rounded p-5 mb-5 cursor-pointer`}>
                  <div><i className={`fa fa-desktop text-primary`} /></div>
                  <div className={`text-primary font-bold text-lg mb-2`}>{item.fullname}</div>
                  <div className={`text-sm text-gray-500`}>{item.email}</div>
                  <div className={`text-sm text-gray-500`}>{item.phoneNo}</div>
                </div>
              ))}
            </div>
          }
        </div>
      }

      <Modal visible={isShowModalCreateUser}
        onCancel={e => {
          formCreateUser.resetFields()
          setIsShowModalCreateUser(false)          
        }}
        title={`Create new user`}
        footer={null}>
        {errors.length > 0 &&
          <div className={`mb-5`}>
            {errors.map((item: any, i: number) => (
              <div key={i} className={`mb-2`}><Alert type={`error`} message={item.message}/></div>
            ))}
          </div>
        }

        <Form form={formCreateUser} onFinish={onFinishCreateUser} layout={`vertical`}>
          <Form.Item label={`Fullname`} name={`fullname`} rules={[{required:true}]} required>
            <Input />
          </Form.Item>
          <Form.Item label={`Email`} name={`email`} rules={[{required:true}]} required>
            <Input />
          </Form.Item>
          <Form.Item label={`Password`} name={`password`} rules={[{required:true}]} required>
            <Input.Password />
          </Form.Item>
          <Form.Item label={`Phone No`} name={`phoneNo`}>
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
  const { id } = ctx.query
  return {
    props: {
      id
    }
  }
}