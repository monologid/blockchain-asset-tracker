import { NextPageContext } from 'next';
import { QRCode } from 'react-qrcode-logo';

export default function AssetQrCodeGeneratorPage({ code }: any) {
  return (
    <QRCode value={code} />
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { code } = ctx.query

  return {
    props: { code }
  }
}