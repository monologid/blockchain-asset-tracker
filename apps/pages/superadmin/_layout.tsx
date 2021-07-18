import Loading from "@/components/icon/loader";
import { Drawer } from "antd";
import Head from "next/head";
import Link from "next/link";
import { FC, useState } from "react";

interface ILayoutSuperAdminProps {
  readonly title: string
  readonly isPageLoading: boolean
}

const LayoutSuperAdmin: FC<ILayoutSuperAdminProps> = ({ title, isPageLoading, children }) => {
  const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false)

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <div className={`w-full flex justify-between items-center bg-primary-color text-white p-5`}>
          <div className={`font-bold uppercase`}>Blockchain Tracker</div>
          <div>
            <i className={`fa fa-bars cursor-pointer`} onClick={e => setIsShowDrawer(true)}/>
          </div>
        </div>

        { isPageLoading ? (
          <div className={`w-full h-screen flex justify-center items-center`}>
            <Loading />
          </div>
        ): (
          <div className={`p-5`}>
            {children}
          </div>
        )}
      </main>

      <Drawer visible={isShowDrawer} onClose={e => setIsShowDrawer(false)}>
        <div className={`mt-10`}>
          <MenuItem title={`Warehouse`} href={`warehouse`} />
          {/* <MenuItem title={`User Management`} href={`user`} /> */}
        </div>
      </Drawer>
    </div>
  )
}

interface IMenuItemProps {
  readonly title: string
  readonly href: string
}

const MenuItem: FC<IMenuItemProps> = ({ title, href }) => (
  <div className={`block mb-2`}>
    <Link href={`/superadmin/${href}`}>{title}</Link>
  </div>
)

export default LayoutSuperAdmin