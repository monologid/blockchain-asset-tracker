import {FC} from "react";
import Head from "next/head";
import Loading from "../icon/loader";
import dynamic from "next/dynamic";
// @ts-ignore
const QrReader = dynamic(() => import('modern-react-qr-reader'), {ssr: false})

interface IMainLayoutProps {
  readonly title: string
  readonly isLoading: boolean
}

const MainLayout: FC<IMainLayoutProps> = ({ title, isLoading = false, children }) => {
  const onQRScan = (data: any) => {
    alert(data)
  }

  const onQRError = (err: any) => {
    alert(err)
  }

  // @ts-ignore
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

            <QrReader delay={300} onError={onQRError} onScan={onQRScan} style={{ width: '100%'}} />

            <div className={`fixed bottom-0 right-0 p-8`}>
              <div className={`bg-primary-color font-bold text-white uppercase h-16 w-16 flex items-center justify-center rounded-full`}>Scan</div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default MainLayout