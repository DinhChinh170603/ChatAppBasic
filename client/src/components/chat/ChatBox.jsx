import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Button, Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import send from "../../assets/send.svg";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, messagesLoading, sendMessage, notifications } =
    useContext(ChatContext);
  const { recipients } = useFetchRecipient(currentChat, user);

  const [textMessage, setTextMessage] = useState("");

  const scroll = useRef(); // auto scroll
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipients) {
    return <p className="text-center mx-auto w-full">No conversation yet...</p>;
  }

  if (messagesLoading) {
    return <p className="text-center mx-auto w-full">Loading chat...</p>;
  }

  return (
    <Stack className="chat-box gap-4">
      <div className="chat-header">
        <strong>{recipients?.name}</strong>
      </div>
      <Stack className="messages gap-3">
        {messages &&
          messages.map((m, index) => (
            <Stack
              key={index}
              className={`${
                m?.senderId === user?._id
                  ? "message self align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
              }`}
              ref={scroll}
            >
              <span>{m.message}</span>
              <span className="message-footer">
                {moment(m.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
      <Stack direction="horizontal" className="chat-input flex-grow-0 gap-3">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          placeholder="Type a message"
          fontFamily="nunito"
          borderColor="rgba(72, 1122, 223, 0.2)"
        />
        <Button
          className="send-btn"
          onMouseEnter={() =>
            sendMessage(textMessage, user, currentChat._id, setTextMessage)
          }
          onClick={() =>
            sendMessage(textMessage, user, currentChat._id, setTextMessage)
          }
        >
          <img src={send} alt="send" />
        </Button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
