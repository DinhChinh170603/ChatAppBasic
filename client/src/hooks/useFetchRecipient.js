import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../helpers/service";

export const useFetchRecipient = (chat, user) => {
    const [recipients, setRecipients] = useState(null);
    const [error, setError] = useState(null);

    // find member in chat without u
    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            if (response.error) {
                return setError(error);
            }
            setRecipients(response);
        }
        getUser();
    }, [recipientId]);

    return { recipients };
};