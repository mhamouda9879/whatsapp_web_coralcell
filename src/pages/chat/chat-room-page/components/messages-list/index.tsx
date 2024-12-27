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
  const { containerRef, lastMessageRef } = useScrollToBottom(
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
          return newMessages;
        }
        return prevMessages;
      });

      // Scroll to the last message after updating messages
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100); // Small delay ensures DOM rendering
    };

    // Start polling the API every second
    messageService.startPollingMessages(Number(contactId), handleNewMessages);

    // Cleanup: Stop polling when the component unmounts
    return () => {
      messageService.stopPollingMessages();
    };
  }, [contactId, lastMessageRef]);

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

  return (
    <ChatMessage
      key={message.id}
      className={message.isOpponent ? "chat__msg--received" : "chat__msg--sent"}
      ref={ref}
    >
      <span>{message.body}</span>
      <ChatMessageFiller />
      <ChatMessageFooter>
        <span>{message.timestamp}</span>
        {!message.isOpponent && (
          <Icon
            id={`${message.messageStatus === "SENT" ? "singleTick" : "doubleTick"}`}
            className={`chat__msg-status-icon ${
              message.messageStatus === "READ" ? "chat__msg-status-icon--blue" : ""
            }`}
          />
        )}
      </ChatMessageFooter>
    </ChatMessage>
  );
});
