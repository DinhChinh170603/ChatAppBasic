import { useState, useEffect, createContext, useCallback } from "react";
import { postRequest, getRequest } from "../helpers/service";
import { baseUrl } from "../helpers/service";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);

  const [potentialChats, setPotentialChats] = useState([]); // list users that user can start a new chat

  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [newMessage, setNewMessage] = useState(null);
  const [sendError, setSendError] = useState(null);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [notifications, setNotifications] = useState([]);

  console.log("Notifications:", notifications);

  // initial socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("new-user-add", user?._id);  // send user id to server when login
    socket.on("get-online-users", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("get-online-users");
    }
  }, [socket]);

  // send message
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("send-message", {
      ...newMessage, recipientId  // send to server
    });
  }, [newMessage])

  // receive message and notification
  useEffect(() => {
    if (socket === null) return;

    socket.on("get-message", (res) => {
      if (currentChat?._id !== res.chatId) return;  // check if idMessage is same with idChat

      setMessages((messages) => [...messages, res]);
    })

    socket.on("get-notification", (res) => {
      const isChatOpen = currentChat?.members?.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((notification) => [{...res, isRead: true}, ...notification]);
      } else {
        setNotifications((notification) => [res, ...notification]);
      }
    })

    return () => {
      socket.off("get-message");
      socket.off("get-notification");
    }
  }, [socket, currentChat])

  // get all users can create a new chat
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return setUserChatsError(response);
      }
      setPotentialChats(response);

      // filter
      const pChats = response.filter((u) => {
        let isChatCreated = false; // check

        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id; // check handling
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setIsUserChatLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user, notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const sendMessage = useCallback(async(textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must enter a message");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          message: textMessage,
        })
      );

      if (response.error) {
        return setSendError(response);
      }
      
      setNewMessage(response);
      setMessages((prevMessages) => [...prevMessages, response]);
      setTextMessage("");
    },[]
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log("Error creating chat", response);
    }
    setUserChats((prevChats) => [...prevChats, response]);
  }, []);

  const markAllNotiAsRead = useCallback((notifications) => {
    const notiToBeUpdated = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(notiToBeUpdated);
  }, []);

  const markNotiAsRead = useCallback((n, userChats, user, notifications) => {
    
    // find chat need to open
    const desiredChat = userChats?.find((chat) => {
      const chatMembers = [user._id, n.senderId];
      const isDesiredChat = chat?.members.every((member) => { return chatMembers.includes(member)
      });
        return isDesiredChat;
    });

    // mark needed notification as read
    const notiToBeUpdated = notifications.map((el) => {
      if (el.senderId === n.senderId) {
        return { ...el, isRead: true };
      } else {
        return el;
      } 
    });

    updateCurrentChat(desiredChat);
    setNotifications(notiToBeUpdated);
  }, []);

  // process specific notiUser
  const markSpecificNotiAsRead = useCallback((thisUserNotifications, notifications) => {
    const notiToBeUpdated = notifications.map((el) => {
      let notification;

      thisUserNotifications.forEach((n) => {
        if (el.senderId === n.senderId) {
          notification = { ...n, isRead: true };
        } else {
          notification = el;
        };
      })
      return notification;
    });
    setNotifications(notiToBeUpdated);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        allUsers,
        isUserChatLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        messagesLoading,
        messagesError,
        currentChat,
        sendMessage,
        onlineUsers,
        notifications,
        markAllNotiAsRead,
        markNotiAsRead,
        markSpecificNotiAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
