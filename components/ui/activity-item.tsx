import { generateLogMessage } from "@/lib/generate-log-message"
import { AuditLog } from "@prisma/client"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { format } from "date-fns"

interface ActivityItemsProps {
    data: AuditLog
}
export const ActivityItem = ({data,
}:ActivityItemsProps) => {
    return (
        <li className="flex items-center gap-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={data.userImage}/>
            </Avatar>
            <div className="flex flex-col space-x-0.5">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold lowercase text-neutral-700">
                        {data.userName}
                    </span> {generateLogMessage(data)}
                </p>
                <p className="text-sm text-muted-foreground">
                    {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
            </div>
        </li>
    )
}