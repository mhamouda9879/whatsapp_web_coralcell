import { useState, useEffect } from "react";
import Icon from "common/components/icons";
import OptionsMenu from "pages/chat/components/option-menu";
import {
  Action,
  Actions,
  actionStyles,
  Avatar,
  AvatarWrapper,
  Container,
  Name,
  ProfileWrapper,
  Subtitle,
  ToggleSwitchWrapper,
  ToggleLabel,
} from "./styles";

type HeaderProps = {
  onSearchClick: () => void;
  onProfileClick: () => void;
  title: string;
  image: string;
  subTitle?: string;
  toggleState: 0 | 1;
  waId: string; // WhatsApp ID for API payload
};

export default function Header({
  onSearchClick,
  onProfileClick,
  title,
  image,
  subTitle = "",
  toggleState,
  waId,
}: HeaderProps) {
  const [isLiveAgent, setIsLiveAgent] = useState<boolean>(toggleState === 1);

  useEffect(() => {
    setIsLiveAgent(toggleState === 1);
  }, [toggleState]);

  const handleToggle = async () => {
    const newToggleState = isLiveAgent ? 0 : 1;
    setIsLiveAgent(!isLiveAgent);

    try {
      const response = await fetch("https://route.coralcell.com/b/api/update_is_live_agent.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wa_id: waId,
          is_live_agent_requested: newToggleState,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
    } catch (error) {
      console.error("Error updating toggle state:", error);
    }
  };

  return (
    <Container isLiveAgent={isLiveAgent}>
      <AvatarWrapper onClick={onProfileClick}>
        <Avatar src={image} alt={`${title} profile`} />
      </AvatarWrapper>
      <ProfileWrapper onClick={onProfileClick}>
        <Name>{title}</Name>
        {subTitle && <Subtitle>{subTitle}</Subtitle>}
      </ProfileWrapper>
      <Actions>
        <ToggleSwitchWrapper isLiveAgent={isLiveAgent}>
          <ToggleLabel>{isLiveAgent ? "Live Agent" : "Robot"}</ToggleLabel>
          <label className="switch">
            <input
              type="checkbox"
              checked={isLiveAgent}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>
        </ToggleSwitchWrapper>
        <Action onClick={onSearchClick}>
          <Icon id="search" className="icon search-icon" />
        </Action>
        <OptionsMenu
          styles={actionStyles}
          ariaLabel="Menu"
          iconId="menu"
          iconClassName="icon"
          options={[
            "Contact Info",
            "Select Messages",
            "Mute notifications",
            "Clear messages",
            "Delete chat",
          ]}
        />
      </Actions>
    </Container>
  );
}
