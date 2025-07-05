"use client";

import NavItem, {Organization } from "@/app/(platform)/(dashboard)/_components/nav-items";


import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
//skeleton used while data is loading 
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
//current org, list of org
import { Plus } from "lucide-react";
import Link from "next/link"
import { useLocalStorage } from "usehooks-ts";
//save and load data from localStorage

interface SidebarProps {
  storageKey?: string;
  //it is not the actual class but the defination of the class (?:)- this means it is optional

}

const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>(
    storageKey,
    {}
  );

  const {
    organization: activeOrganization,
    isLoaded: isLoadedOrg,
  } = useOrganization(); //Gets the active organization and whether it has finished loading.

  const {
    userMemberships,//the data (and loading state)
    isLoaded: isLoadedOrgList,//tells if the list is done loading
  } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const defaultAccordionValue = Object.keys(expanded).filter(
    (key) => expanded[key]
  );

  const onExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return(
      <>
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-10 w-[50%]"/>
        <Skeleton className="h-10 w-10"/>
      </div>
      <div className="space-y-2">
        <NavItem.skeleton/>
        <NavItem.skeleton/>
        <NavItem.skeleton/>
      </div>
      </>
    ) 
  }

  return (
    <>
    <div className="font-medium text-xs flex items-center mb-1 ">
        <span className="pl-4">
            Workspace
        </span>
        <Button
        asChild
        type="button"
        size="icon"
        variant="ghost"
        className="ml-auto">
            <Link href="/select-org">
            <Plus className="h-4 w-4"/>
            </Link>
        </Button>
    </div>
    <Accordion 
    type="multiple"
    defaultValue={defaultAccordionValue}
    className="space-y-2"
    >
        {userMemberships.data.map(({organization}) =>(
            <NavItem
            key = {organization.id}
            isActive = {activeOrganization?.id === organization.id}
            organization = {organization as Organization}
            onExpand = {onExpand}
            />
        ))}
    </Accordion>

    </>
  );
};

export default Sidebar;
