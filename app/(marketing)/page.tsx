import { Button } from "@/components/ui/button"
import { Medal } from "lucide-react"

import { Poppins } from "next/font/google"
import Link from "next/link"
import { cn } from "@/lib/utils"

const textFont = Poppins({
    subsets: ["latin"],
    weight:[
        "100", "200","300","400","500","600","700","800","900"
    ]
})

const MarketingPage = () =>{

    return(
        <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center flex-col">
                <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
                    <Medal className="h-6 w-6 mr-2"/>
                    No 1 task managment 
                </div>
                <h1 className="text-4xl md:text-6xl text-center text-neutral-800 mb-6 font-extrabold font-sans">
                    Taskify helps team move
                </h1>

                <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit ">
                    Work Forward.
                </div>
            </div>
            <div className={cn(
                textFont.className,
                "tex-sm md:text-xl text-neutral-400 mt-4 max-w-sm md:max-w-2xl text-center mx-auto")}>
                Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique - accomplish it all with Taskify
            </div>

            <Button className="mt-6" size="lg" asChild>
                <Link href="/sign-up">
                 Get Taskify for free
                </Link>
            </Button> 
        </div>
    )
}

export default MarketingPage