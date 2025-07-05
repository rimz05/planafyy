import {startCase} from "lodash";
import { OrgControl } from "./_components/org-control"
import { auth } from "@clerk/nextjs/server";


export async function generateMetadata() {
  const {orgSlug} = await auth();

  return {
    title: startCase(orgSlug || "organization"),
  }
}

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
