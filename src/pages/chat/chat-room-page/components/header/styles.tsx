import styled, { css } from "styled-components";

interface ContainerProps {
  isLiveAgent: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: ${(props) =>
    props.isLiveAgent
      ? props.theme.common.liveAgentBackgroundColor
      : props.theme.common.robotBackgroundColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 10px;
  min-height: 60px;
  z-index: 10;

  .icon {
    color: ${(props) => props.theme.common.headerIconColor};
  }

  .search-icon {
    width: 30px;
    height: 30px;
  }
`;

export const AvatarWrapper = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
`;

export const Avatar = styled.img`
  border-radius: 50%;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const ProfileWrapper = styled.div<{ onClick: () => void }>`
  flex: 1;
  cursor: pointer;
`;

export const profileStyles = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Name = styled.h2`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 1rem;
  margin-bottom: 2px;

  ${profileStyles}
`;

export const Subtitle = styled.p`
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.75rem;

  ${profileStyles}
`;

export const Actions = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;

  .action-menus-wrapper {
    z-index: 20;
  }
`;

export const actionStyles = css`
  margin-left: 25px;
  cursor: pointer;
`;

export const Action = styled.button`
  ${actionStyles}
`;

export const ToggleSwitchWrapper = styled.div<{ isLiveAgent: boolean }>`
  display: flex;
  align-items: center;
  margin-right: 15px;
  border: 2px solid
    ${(props) =>
      props.isLiveAgent
        ? props.theme.common.liveAgentBorderColor
        : props.theme.common.robotBorderColor};
  border-radius: 34px;
  padding: 5px;

  .switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
    margin-left: 10px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: ${(props) => props.theme.common.primaryColor};
  }

  input:checked + .slider:before {
    transform: translateX(14px);
  }
`;

export const ToggleLabel = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.common.mainHeadingColor};
  margin-right: 5px;
`;
