import SvgImage from "components/svg";
import MainLayout from "components/layout/main";
import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [assets, setAssets] = useState<Array<any>>([
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
    {
      serialNumber: 'ISOT-00001',
      status: 'Shipping',
      location: 'Bandung'
    },
  ])

  return (
    <MainLayout title={`Home`} isLoading={false}>
      {assets.length == 0 &&
        <div className={`flex flex-col justify-center items-center`} style={{height: 600}}>
          <SvgImage src={`empty`} />
          <br/>
          No asset has been registered.
        </div>
      }

      {assets.length > 0 &&
        <div className={`p-5 md:p-0 my-5`}>
          <div className={`font-bold text-primary text-xl mb-1`}>Tanks</div>
          <div className={`text-gray-400 mb-7`}>List of registered tanks</div>
          {assets.map((item, i) => (
            <Link key={i} href={`/tank/${item.serialNumber}`}>
              <div className={`border rounded p-5 mb-5 cursor-pointer`}>
                <div><i className={`fa fa-ship text-primary`} /></div>
                <div className={`text-primary font-bold text-lg mb-2`}>{item.serialNumber}</div>
                <div className={`flex justify-between items-center text-gray-400 text-xs`}>
                  <div>Status: {item.status}</div>
                  <div>Location: {item.location}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      }
    </MainLayout>
  )
}
