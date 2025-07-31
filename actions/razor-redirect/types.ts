import {z} from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { RazorRedirect } from "./schema";

export type InputType = z.infer<typeof RazorRedirect>

export type ReturnType = ActionState<InputType, string> 