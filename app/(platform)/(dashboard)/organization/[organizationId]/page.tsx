import { useOrganization } from "@clerk/nextjs";
import { Info } from "./_components/info";
import { Separator } from "@radix-ui/react-separator";
import { BoardList } from "./_components/board-list";
import { Suspense } from "react";


const OrganizationIdPage = async () => {
  return (
    <div className="mb-20">
      <Info/>
      <Separator className="my-4"/>
      <div className="px-2 md:px-4">
        <Suspense fallback= {<BoardList.Skeleton/>}>
        <BoardList/>
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
