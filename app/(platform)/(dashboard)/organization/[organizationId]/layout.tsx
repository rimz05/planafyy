import { OrgControl } from "./_components/org-control"

const OrganisatioIdLayout = (
    {children}:
    {children: React.ReactNode}
) => {
  return (
    <div>
      <OrgControl/>
      {children}
    </div>
  )
}

export default OrganisatioIdLayout
