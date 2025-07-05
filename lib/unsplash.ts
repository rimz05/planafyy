import { createApi } from "unsplash-js"

export const unplash = createApi({
    accessKey : process.env.NEXT_PUBLIC_UNPLASH_ACCESS_KEY!,
    fetch: fetch,
})