import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const potentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <div className="all-users">
      {potentialChats &&
        potentialChats.map((u, index) => {
          return (
            <div
              className="single-user"
              key={index}
              onClick={() => createChat(user._id, u._id)} // create with 1 and 2
            >
              {u.name}
              <span
                className={
                  onlineUsers.some((user) => user?.userId === u?._id)
                    ? "user-online"
                    : ""
                }
              ></span>
            </div>
          );
        })}
    </div>
  );
};

export default potentialChats;
