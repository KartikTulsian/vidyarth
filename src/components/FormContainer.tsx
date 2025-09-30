import React from 'react'
import FormModal from './FormModal';
// import { auth } from '@clerk/nextjs/server';

export type FormContainerProps = {
    table:
    | "stuffOffer"
    | "review"
    | "request"
    | "trade"
    | "reminder"
    | "user"
    type: "create" | "update" | "delete";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    id?: string;
}

export default async function FormContainer({ table, type, data, id }: FormContainerProps) {
    let relatedData = {}

    // const { userId, sessionClaims } = await auth();
    // const role = (sessionClaims?.metadata as { role?: string })?.role;
    // const currentUserId = userId;

    if (type !== "delete") {
        switch (table) {
            case "stuffOffer":
                // maybe later fetch tags, but optional
                relatedData = {};
                break;

            case "review":
                const reviewType = ["UNIVERSAL_STUFF", "THANK_YOU_MESSAGE", "USER_RATING"];
                relatedData = { reviewType };
                break;
            case "trade":
                relatedData = {};
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    )
}
