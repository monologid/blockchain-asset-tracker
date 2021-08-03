import { NextPageContext } from "next"
import { parseCookies } from "nookies"
import { useState } from "react"
import LayoutSuperAdmin from "../_layout"

export default function WarehouseReport() {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)

  return (
    <LayoutSuperAdmin title={`Warehouse Report Detail`} isPageLoading={isPageLoading}>
      test        
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