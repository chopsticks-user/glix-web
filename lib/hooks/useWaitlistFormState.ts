import addToWaitlist from "@/lib/actions/addToWaitlist";

import {useActionState} from "react";

export default function useWaitlistFormState() {
    return useActionState(
        addToWaitlist, {
            success: false,
            message: "",
            data: {
                email: "",
            },
        }
    );
}