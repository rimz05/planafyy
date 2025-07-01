import {z} from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CreatBoard } from "./schema";


export type InputType = z.infer<typeof CreatBoard>

export type ReturnType = ActionState<InputType, Board>