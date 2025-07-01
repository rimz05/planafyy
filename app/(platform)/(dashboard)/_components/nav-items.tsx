"use client"
import { AccordionItem } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, CreditCard, icons, Layout, Settings } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import path from "path";
import { Skeleton } from "@/components/ui/skeleton";

export type Organization ={
    id: string;
    slug:string;
    imageUrl:string;
    name:string;
}

interface NavItemProps{
    isExpanded: boolean;
    isActive: boolean;
    organization: Organization; 
    onExpand: (id:string) =>void;
}

const NavItem = ({
    isExpanded, isActive, organization, onExpand
}: NavItemProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const routes = [
        {
            label:"Boards",
            icon: <Layout className="h-4 w-4 mr-2"/>,
            href: `/organization/${organization.id}`
        },
        {
            label:"Activity",
            icon: <Activity className="h-4 w-4 mr-2"/>,
            href: `/organization/${organization.id}/activity`
        },
        {
            label:"Settings",
            icon: <Settings className="h-4 w-4 mr-2"/>,
            href: `/organization/${organization.id}/settings`
        },
         {
            label:"Billing",
            icon: <CreditCard className="h-4 w-4 mr-2"/>,
            href: `/organization/${organization.id}/billing`
        }
    ]

    const onClick = (href: string) =>{
        router.push(href)
    }

  return (
    <div>
      <AccordionItem
      value={organization.id}
      className="border-none">
        <AccordionTrigger
        onClick={()=> onExpand(organization.id)}
        className={
            cn("flex w-full items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-star no-underline hover:no-underline",
                isActive && !isExpanded && "bg-sky-500/10 text-sky-700 "
            )}>
            <div className="flex items-center gap-x-2">
                <div className="w-7 h-7 relative">
                    <Image
                    fill
                    src= {organization.imageUrl}
                    alt ="Organization"
                    className= "rounded-sm object-cover"
                    />
                </div>
                <span className="font-medium text-sm">
                    {organization.name}
                </span>
            </div>
        </AccordionTrigger> 
        <AccordionContent className="pt-1 text-neutral-700">
            {routes.map((route)=>(
                <Button
                key={route.label}
                size="sm"
                onClick={()=> onClick(route.href)}
                className={cn("w-full font-medium justify-start pl-10 mb-1", pathname === route.href && "bg-sky-500/10 text-sky-700")}
                variant="ghost">
                    {route.icon}
                    {route.label}
                </Button>
            ))}

        </AccordionContent>
      </AccordionItem>
    </div>
  )
}

NavItem.skeleton = function SkeletonNavItem(){
    return(
        <div className="flex items-center gap-x-2">
            <div className="w-10 h-10 relative shrink">
                <Skeleton className="h-full w-full absolute"/>
            </div>
            <Skeleton className="h-10 w-full"/>
        </div>
    )
}


export default NavItem
