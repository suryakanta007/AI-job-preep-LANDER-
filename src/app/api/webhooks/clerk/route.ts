import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const event = await verifyWebhook(request)

        switch(event.type){
             case "user.created":
                case "user.updated":
                    break
            case "user.deleted":
                break
        }
    } catch (error) {
        return new Response("Invalid webhook",{status:400})
    }

    return new Response("Webhook received",{status:200})
}