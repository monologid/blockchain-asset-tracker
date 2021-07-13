import { ButtonPrimaryLink } from "@/components/button";
import SvgImage from "@/components/svg";
import { Avatar } from "antd";
import { NextPageContext } from "next";
import { useState } from "react";
import LayoutSuperAdmin from "../_layout";

export default function SuperadminWarehousePage() {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [users, setUsers] = useState<Array<any>>([
    {
      id: '1',
      fullname: 'Loki',
      email: 'loki@avengers.com'
    },
    {
      id: '2',
      fullname: 'Thor',
      email: 'thor@avengers.com'
    }
  ])

  return (
    <LayoutSuperAdmin title={`User Management`} isPageLoading={isPageLoading}>
      {users.length == 0 &&
        <div className={`flex flex-col justify-center items-center`} style={{height: 600}}>
          <SvgImage src={`empty_street`} />
          
          <div className={`mb-5`}>
            No users has been registered.
          </div>
          
          <ButtonPrimaryLink title={`+ Create`} href={`/superadmin/user/create`} />
        </div>
      }

      {users.length > 0 &&
        <div className={`p-5`}>
          <div className={`flex justify-between items-center  mb-5`}>
            <div className={`text-primary text-lg font-bold`}>Users</div>
            <div>
              <ButtonPrimaryLink title={`+ Create`} href={`/superadmin/user/create`}/>
            </div>
          </div>
          {users.map((item, i) => (
            <div key={i} className={`grid grid-cols-5 gap-2 p-2 rounded-full mb-3 flex items-center border`}>
              <div className={`col-span-1`}>
                <Avatar style={{backgroundColor: '#2F5D62', color: 'white'}} size={`large`}>{item.fullname[0]}</Avatar>
              </div>
              <div className={`col-span-3`}>
                {item.fullname}
              </div>
              <div className={`col-span-1`}>
                <ButtonPrimaryLink title={`Edit`} href={`/superadmin/user/${item.id}`} />
              </div>
            </div>
          ))}
        </div>
      }
    </LayoutSuperAdmin>
  )
}

export async function getStaticProps(ctx: NextPageContext) {
  return { 
    props: {}
  }
}