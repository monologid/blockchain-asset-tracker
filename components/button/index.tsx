import Link from "next/link"

const ButtonPrimary = ({ title, className = '' }: any) => (
  <button className={`bg-primary-color text-white p-2 px-5 rounded ${className}`} type={`submit`}>
    {title}
  </button>
)

const ButtonPrimaryLink = ({ title, href }: any) => (
  <Link href={href}>
    <button className={`bg-primary-color text-white p-2 px-5 rounded-full text-xs`}>{title}</button>
  </Link>
)

export {
  ButtonPrimary,
  ButtonPrimaryLink
}