import dynamic from "next/dynamic";
import {FC, useState} from "react";
// @ts-ignore
const QrReader = dynamic(() => import('modern-react-qr-reader'), {ssr: false})

interface IScannerProps {
  readonly onQRError: Function
  readonly onQRScan: Function
  readonly isShow: boolean
  readonly setIsShow: Function
}

const Scanner: FC<IScannerProps> = ({ onQRError, onQRScan, isShow, setIsShow }) => {
  return (
    <>
      {isShow &&
        <div className={`flex flex-col justify-center items-center h-30`}>
          {// @ts-ignore
            <QrReader delay={300} onError={onQRError} onScan={onQRScan} style={{ width: 420 }} />
          }
          <div className={`mt-10`}>
            <button
              className={`bg-primary-color font-bold text-xs text-white uppercase h-20 w-20 flex items-center justify-center rounded-full`}
              onClick={e => setIsShow(false)}>Close Scanner</button>
          </div>
        </div>
      }
    </>
  )
}

export default Scanner