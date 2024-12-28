import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Icon from "common/components/icons";
import useScrollToBottom from "./hooks/useScrollToBottom";
import { Message } from "common/types/common.type";
import { MessageService } from "./data/get-messages";
import {
  ChatMessage,
  ChatMessageFiller,
  ChatMessageFooter,
  Container,
  Date,
  DateWrapper,
  EncryptionMessage,
  MessageGroup,
} from "./styles";

type MessagesListProps = {
  onShowBottomIcon: Function;
  shouldScrollToBottom?: boolean;
};

export default function MessagesList(props: MessagesListProps) {
  const { onShowBottomIcon, shouldScrollToBottom } = props;
  const { id: contactId } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const { containerRef, lastMessageRef, resetManualScroll } = useScrollToBottom(
    onShowBottomIcon,
    shouldScrollToBottom,
    contactId
  );

  useEffect(() => {
    if (!contactId) return;

    const messageService = new MessageService();

    // Callback to handle new messages
    const handleNewMessages = (newMessages: Message[]) => {
      setMessages((prevMessages) => {
        // Only update if new messages are different
        if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
          // Reset manual scrolling if the user hasn't interacted with the scroll
          if (!isUserScrolling) {
            resetManualScroll();
            setTimeout(() => {
              lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
            }, 100); // Small delay ensures DOM rendering
          }
          return newMessages;
        }
        return prevMessages;
      });
    };

    // Start polling the API every second
    messageService.startPollingMessages(Number(contactId), handleNewMessages);

    // Cleanup: Stop polling when the component unmounts
    return () => {
      messageService.stopPollingMessages();
    };
  }, [contactId, lastMessageRef, isUserScrolling, resetManualScroll]);

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = ref;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;

      if (!isAtBottom) {
        setIsUserScrolling(true);
      } else {
        setIsUserScrolling(false);
      }
    };

    ref.addEventListener("scroll", handleScroll);

    return () => ref.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  return (
    <Container ref={containerRef}>
      <EncryptionMessage>
        <Icon id="lock" className="icon" />
        Messages are end-to-end encrypted. No one outside of this chat, not even Coralcell, can read
        or listen to them. Click to learn more.
      </EncryptionMessage>
      <DateWrapper>
        <Date> TODAY </Date>
      </DateWrapper>
      <MessageGroup>
        {messages.map((message, i) => (
          <SingleMessage
            key={message.id}
            message={message}
            ref={i === messages.length - 1 ? lastMessageRef : null} // Attach lastMessageRef to the last message
          />
        ))}
      </MessageGroup>
    </Container>
  );
}


const SingleMessage = React.forwardRef<HTMLDivElement, { message: Message }>((props, ref) => {
  const { message } = props;

  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    if (message.timestamp) {
      const [hoursStr, minutes] = message.timestamp.split(":");
      let hours = parseInt(hoursStr, 10);
      if (isNaN(hours)) {
        setTime("Invalid Time");
        return;
      }
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${period}`);
    }
  }, [message.timestamp]);

  // Function to convert text between ** into bold
  const formatMessage = (text: string) => {
    if (!text) return text;

    // Replace any text between asterisks (*) with <span> having bold and increased font size
    return text.replace(
      /\*(.*?)\*/g,
      (_, match) => `<span style="font-weight: bold; font-size: 1em;">${match}</span>`
    );
  };

  return (
    <ChatMessage
      key={message.id}
      className={message.isOpponent ? "chat__msg--received" : "chat__msg--sent"}
      ref={ref}
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
    >
      <span
        style={{ textAlign: "right", padding: "0em 1em 0.7em 1em" }}
        dangerouslySetInnerHTML={{ __html: formatMessage(message.body) }}
      ></span>
      <ChatMessageFiller />
      <ChatMessageFooter style={{ marginTop: "0.5em" }}>
        <span>{time}</span>
        {!message.isOpponent && (
          <Icon
            id={`${message.messageStatus === "SENT" ? "singleTick" : "doubleTick"}`}
            className={`chat__msg-status-icon ${message.messageStatus === "READ" ? "chat__msg-status-icon--blue" : ""
              }`}
          />
        )}
      </ChatMessageFooter>
    </ChatMessage>
  );
});
