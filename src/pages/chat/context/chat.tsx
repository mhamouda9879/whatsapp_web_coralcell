import React, { useState, useEffect } from "react";
import { Inbox } from "common/types/common.type";
import { InboxService } from "../data/inbox"; // Import your dynamic service

type User = {
  name: string;
  image: string;
};

type ChatContextProp = {
  user: User;
  inbox: Inbox[];
  activeChat?: Inbox;
  onChangeChat: (chat: Inbox) => void;
};

const initialValue: ChatContextProp = {
  user: {
    name: "Coralcell Limited",
    image: `${process.env.PUBLIC_URL}/assets/images/girl.jpeg`,
  },
  inbox: [], // Start with an empty array for inbox
  onChangeChat() {
    throw new Error("Function not implemented");
  },
};

export const ChatContext = React.createContext<ChatContextProp>(initialValue);

export default function ChatProvider(props: { children: any }) {
  const { children } = props;

  const [user] = useState<User>(initialValue.user);
  const [inbox, setInbox] = useState<Inbox[]>(initialValue.inbox);
  const [activeChat, setActiveChat] = useState<Inbox>();
  const inboxService = new InboxService(); // Create instance of InboxService outside useEffect

  useEffect(() => {
    // Callback to handle updated inbox data
    const handleInboxData = (updatedInbox: Inbox[]) => {
      setInbox((prevInbox) => {
        // Compare previous state with new data
        if (JSON.stringify(prevInbox) !== JSON.stringify(updatedInbox)) {
          console.log("Updating inbox state:", updatedInbox);
          return updatedInbox; // Update the state if data has changed
        }
        return prevInbox; // Keep the previous state if data is the same
      });
    };

    // Start the refreshing loop
    inboxService.startRefreshingInboxData(handleInboxData);

    // Cleanup function to stop refreshing when the component unmounts
    return () => {
      inboxService.stopRefreshingInboxData();
    };
  }, [inboxService]); // Dependency array includes inboxService to ensure cleanup

  const handleChangeChat = (chat: Inbox) => {
    setActiveChat(chat);
  };

  return (
    <ChatContext.Provider value={{ user, inbox, activeChat, onChangeChat: handleChangeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => React.useContext(ChatContext);
