import { ReactNode } from "react"
import { ClerkProvider as OrginalClerkProvider } from "@clerk/nextjs"
export function ClerkProvider({children}:{children:ReactNode})
{
    return <OrginalClerkProvider>{children}</OrginalClerkProvider>
}