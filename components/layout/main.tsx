import {FC, useState} from "react";
import Head from "next/head";
import Loading from "../icon/loader";
import Scanner from "@/components/scanner";
import { Drawer } from "antd";

interface IMainLayoutProps {
  readonly title: string
  readonly isLoading: boolean
}

const MainLayout: FC<IMainLayoutProps> = ({ title, isLoading = false, children }) => {
  const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [isShowScanner, setIsShowScanner] = useState<boolean>(false)
  const onQRScan = (data: any) => {
    if (data) {
      setIsShowScanner(false)
      alert(data)
      setIsPageLoading(true)
    }
  }

  const onQRError = (err: any) => {
    alert(err)
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

              {!isShowScanner &&
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

      </Drawer>
    </div>
  )
}

export default MainLayout