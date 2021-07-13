import {FC, useState} from "react";
import Head from "next/head";
import Loading from "../icon/loader";
import dynamic from "next/dynamic";
import Scanner from "../scanner";
// @ts-ignore
const QrReader = dynamic(() => import('modern-react-qr-reader'), {ssr: false})

interface IMainLayoutProps {
  readonly title: string
  readonly isLoading: boolean
}

const MainLayout: FC<IMainLayoutProps> = ({ title, isLoading = false, children }) => {
  const [isShowScanner, setIsShowScanner] = useState<boolean>(false)
  const onQRScan = (data: any) => {
    alert(data)
  }

  const onQRError = (err: any) => {
    alert(err)
  }

  return (
    <div>
      <Head>{title}</Head>

      <main>
        { isLoading ? (
          <div className={`w-full h-screen flex justify-center items-center`}>
            <Loading />
          </div>
        ): (
          <>
            <div className={`w-full flex justify-between items-center bg-primary-color text-white p-5`}>
              <div className={`font-bold uppercase`}>Blockchain Tracker</div>
              <div>
                <i className={`fa fa-bars`} />
              </div>
            </div>

            {children}

            <Scanner
              onQRError={onQRError}
              onQRScan={onQRScan}
              isShow={isShowScanner}
              setIsShow={setIsShowScanner} />

            <div className={`fixed bottom-0 right-0 p-8`}>
              <button
                className={`bg-primary-color font-bold text-white uppercase h-16 w-16 flex items-center justify-center rounded-full`}
                onClick={e => setIsShowScanner(true)}>Scan</button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default MainLayout