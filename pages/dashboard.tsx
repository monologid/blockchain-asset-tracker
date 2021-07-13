import SvgImage from "../components/svg";
import SideNavLayout from "../components/layout/sidenav";
import MainLayout from "../components/layout/main";

export default function Dashboard() {
  return (
    <MainLayout title={`Home`} isLoading={false}>
      <div className={`flex flex-col justify-center items-center`} style={{height: 600}}>
        <SvgImage src={`empty`} />
        <br/>
        No asset has been registered.
      </div>
    </MainLayout>
  )
}
