import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { useFetchLastMessage } from "../../hooks/useFetchLastestMessage";
import { unreadNotificationsFunc } from "../../helpers/unreadNotifications";
import avatar from "../../assets/ava.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import moment from "moment";

const UserList = ({ chat, user }) => {
  const { recipients } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, markSpecificNotiAsRead } =
    useContext(ChatContext);

  const { lastestMessage, fetchLastestMessage } = useFetchLastMessage(chat);

  const isOnline = onlineUsers.some((user) => user?.userId === recipients?._id);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications.filter(
    (notification) => notification.senderId === recipients?._id
  );

  const demoText = (message) => {
    let shortenedText = message.substring(0, 15);

    if (message.length > 15) {
      shortenedText += "...";
    }
    return shortenedText;
  };

  const formatTime = (createdAt) => {
    const now = moment();
    const messageTime = moment(createdAt);
  
    const diffInDays = now.diff(messageTime, "days");
  
    if (diffInDays === 0) {
      return messageTime.fromNow();
    } else if (diffInDays === 1) {
      return "yesterday";
    } else if (diffInDays <= 3) {
      return messageTime.fromNow();
    } else {
      return moment(createdAt).format("MMM D, YYYY");
    }
  };

  return (
    <Stack
      direction="horizontal"
      className="user-card align-items-center gap-3 p-2 justify-content-between"
      role="button"
      onClick={() => {
        if (thisUserNotifications.length > 0) {
          markSpecificNotiAsRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="profile" height="35px" />
        </div>
        <div className="text-content">
          <div className="name">{recipients?.name}</div>
          <div className="text">
            {lastestMessage?.message && (
              <span>{demoText(lastestMessage?.message)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        {lastestMessage ? (
            <div className="date">{formatTime(lastestMessage?.createdAt)}</div>
        ) : null}
        <div
          className={
            thisUserNotifications.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications.length > 0 ? thisUserNotifications.length : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserList;
