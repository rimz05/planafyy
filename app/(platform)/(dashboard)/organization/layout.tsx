import Sidebar from "../_components/sidebar"

const OrganizationLayout = ({ children }:{
    children: React.ReactNode
}) => {
  return (
    <div className="pt-20 md:pt-24 px-4 max-w-full 2xl:max-w-screen">
        <div className="flex gap-x-7">
            <div className="w-64 shrink-0 hidden md:block">
                <Sidebar/>
            </div> 
            <div className="w-full">
                {children}
            </div>
        </div>
    </div>
  )
}

export default OrganizationLayout
