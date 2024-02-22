export const unreadNotificationsFunc = (notifications) => {
    return notifications.filter((notification) => notification.isRead === false); // which is not readed
}