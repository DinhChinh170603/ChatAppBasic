import { useEffect, useState, useContext } from "react";
import { baseUrl, getRequest } from "../helpers/service";
import { ChatContext } from "../context/ChatContext";

export const useFetchLastMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [lastestMessage, setLastestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

            if (response.error) {
                return console.log("Error getting messages", error);
            }

            const lastMessage = response[response?.length - 1];
            setLastestMessage(lastMessage);
        };
        getMessages();

    }, [newMessage, notifications]);

    return { lastestMessage };
}