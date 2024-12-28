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
  subTitle?: string; // Subtitle is optional
  toggleState: 0 | 1; // 0 for Robot, 1 for Live Agent (Required parameter)
};

export default function Header({
  onSearchClick,
  onProfileClick,
  title,
  image,
  subTitle = "",
  toggleState,
}: HeaderProps) {
  const [isLiveAgent, setIsLiveAgent] = useState<boolean>(toggleState === 1);

  useEffect(() => {
    // Update state if the `toggleState` prop changes
    setIsLiveAgent(toggleState === 1);
  }, [toggleState]);

  const handleToggle = () => {
    const newToggleState = !isLiveAgent;
    setIsLiveAgent(newToggleState);
    console.log(`Switched to: ${newToggleState ? "Live Agent" : "Robot"} mode`);
    // Add any additional logic here, such as API calls
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
