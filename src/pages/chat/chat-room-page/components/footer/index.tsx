import { useState } from "react";
import axios from "axios";
import Icon from "common/components/icons";
import {
  AttachButton,
  Button,
  ButtonsContainer,
  IconsWrapper,
  Input,
  SendMessageButton,
  Wrapper,
} from "./styles";

const attachButtons = [
  { icon: "attachRooms", label: "Choose room" },
  { icon: "attachContacts", label: "Choose contact" },
  { icon: "attachDocument", label: "Choose document" },
  { icon: "attachCamera", label: "Use camera" },
  { icon: "attachImage", label: "Choose image" },
];

const API_URL = "https://wa.coralcell.com/process-message";
const AUTH_TOKEN = "Bearer EAATpZAVImSb8BOzCxpl8JqdiZBtEDWd8TN9vBTru7ZB6oYxJ6jBl3qg4b8UzzgD679C1yuJLsWBBgryZCSm4zYsaamdP6hsWbNWjwRg2ixNh0nCTiQgOkUeMbYoGvW01NOkv0de0RLHJJuljUG0ygWR9idyJgRZBn73SnLm7ZCt7ROR9VUot1160zZBtzB3RjMoQdqPuFkEqllSGi3MFLZC81q7O85sZD";

async function sendMessage(to, message) {
  try {
    const payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body: message,
      },
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });
    console.log("Message sent successfully", response.data);
  } catch (error) {
    console.error("Failed to send message", error);
  }
}

export default function Footer({ chatId }) {
  const [showIcons, setShowIcons] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      if (!chatId) {
        console.error("chatId is missing. Cannot send message.");
        return;
      }

      console.log("Sending message:", message);
      console.log("Recipient (chatId):", chatId);

      sendMessage(chatId, message)
        .then(() => {
          console.log("Message successfully sent");
          setMessage(""); // Clear the input field after sending
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    } else {
      console.error("Message is empty. Cannot send message.");
    }
  };

  return (
    <Wrapper>
      <IconsWrapper>
        <AttachButton onClick={() => setShowIcons(!showIcons)}>
          <Icon id="attach" className="icon" />
        </AttachButton>
        <ButtonsContainer>
          {attachButtons.map((btn) => (
            <Button showIcon={showIcons} key={btn.label}>
              <Icon id={btn.icon} />
            </Button>
          ))}
        </ButtonsContainer>
      </IconsWrapper>
      <Input
        placeholder="Type a message here .."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <SendMessageButton onClick={handleSend}>
        <Icon id="send" className="icon" />
      </SendMessageButton>
    </Wrapper>
  );
}
