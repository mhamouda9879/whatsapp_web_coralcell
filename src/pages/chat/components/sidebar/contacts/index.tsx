import Icon from "common/components/icons";
import { Inbox } from "common/types/common.type";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import {
  Avatar,
  AvatarWrapper,
  BottomContent,
  Contact,
  Content,
  MessageStatusIcon,
  MessageWrapper,
  Name,
  Subtitle,
  Time,
  TopContent,
  UnreadContact,
} from "./styles";

type InboxContactProps = {
  inbox: Inbox;
  onChangeChat?: Function;
  isActive?: boolean;
};



export default function InboxContact(props: InboxContactProps) {
  const { onChangeChat, isActive } = props;
  const { name, lastMessage, image, timestamp } = props.inbox;

  const handleChangeChat = () => {
    if (onChangeChat) {
      onChangeChat(props.inbox);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isThisWeek(date)) {
      return format(date, "EEEE"); // Day name (e.g., Monday, Tuesday)
    } else {
      return format(date, "dd/MM/yyyy"); // Default to date format
    }
  };

  return (
    <Contact isActive={isActive} onClick={handleChangeChat}>
      <AvatarWrapper>
        <Avatar src={image} />
      </AvatarWrapper>
      <Content>
        <TopContent>
          <Name>{name}</Name>
          {timestamp && lastMessage ? <Time>{formatTimestamp(timestamp)}</Time> : <Trailing {...props.inbox} />}
        </TopContent>

        <BottomContent>
          <MessageWrapper>
            <Message {...props.inbox} />
          </MessageWrapper>

          {timestamp && lastMessage && <Trailing {...props.inbox} />}
        </BottomContent>
      </Content>
    </Contact>
  );
}

function Message(props: Pick<Inbox, "messageStatus" | "lastMessage">) {
  const { lastMessage, messageStatus } = props;

  if (!lastMessage) return <></>;

  const formatMessage = (message: string) => {
    const MAX_LENGTH = 70;
    if (message.length > MAX_LENGTH) {
      return message.substring(0, MAX_LENGTH) + "...";
    }
    return message;
  };

  return (
    <>
      <MessageStatusIcon
        isRead={messageStatus === "READ"}
        id={messageStatus === "SENT" ? "singleTick" : "doubleTick"}
      />
      <Subtitle>{formatMessage(lastMessage)}</Subtitle>
    </>
  );
}

function Trailing(props: Pick<Inbox, "isPinned" | "notificationsCount">) {
  const { isPinned, notificationsCount } = props;

  return (
    <div className="sidebar-contact__icons">
      {isPinned && <Icon id="pinned" className="sidebar-contact__icon" />}

      {notificationsCount !== undefined && notificationsCount > 0 && (
        <UnreadContact>{notificationsCount}</UnreadContact>
      )}

      <button aria-label="sidebar-contact__btn">
        <Icon id="downArrow" className="sidebar-contact__icon sidebar-contact__icon--dropdown" />
      </button>
    </div>
  );
}
