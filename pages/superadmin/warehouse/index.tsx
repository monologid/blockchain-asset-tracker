import { ButtonPrimaryLink } from "@/components/button";
import SvgImage from "@/components/svg";
import { NextPageContext } from "next";
import { useState } from "react";
import LayoutSuperAdmin from "../_layout";

export default function SuperadminWarehousePage() {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [warehouses, setWarehouses] = useState<Array<any>>([])

  return (
    <LayoutSuperAdmin title={`Warehouse`} isPageLoading={isPageLoading}>
      {warehouses.length == 0 &&
        <div className={`flex flex-col justify-center items-center`} style={{height: 600}}>
          <SvgImage src={`empty`} />
          
          <div className={`my-5`}>
            No warehouse has been registered.
          </div>
          
          <ButtonPrimaryLink title={`+ Create`} href={`/superadmin/warehouse/create`} />
        </div>
      }

      {warehouses.map((item, i) => (
        <div key={i}>
          
        </div>
      ))}
    </LayoutSuperAdmin>
  )
}

export async function getStaticProps(ctx: NextPageContext) {
  return { 
    props: {}
  }
}