import ChatLayout from "../layouts";
import Icon from "common/components/icons";
import { useAppTheme } from "common/theme";
import { Container, ImageWrapper, Title, IconWrapper, Link, Image, Text } from "./styles";

export default function UnSelectedChatPage() {
  const theme = useAppTheme();

  const getImageURL = () => {
    const baseUrl = process.env.PUBLIC_URL || "";
    if (theme.mode === "light") return `${baseUrl}/assets/images/entry-image-light.webp`;
    return `${baseUrl}/assets/images/entry-image-dark.webp`;

  };

  return (
    <ChatLayout>
      <Container>
        <ImageWrapper>
          <Image src={getImageURL()} />
        </ImageWrapper>
        <Title> Coralcell Chat </Title>
        <Text>
          Send and receive messages without keeping your phone online. <br />
          Use Coralcell on up to 4 linked devices and 1 phone at the same time.
        </Text>
        <Text>
          <span>Built by</span>{" "}
          <Link target="_blank" href="https://coralcell.com">
            Coralcell Limited
          </Link>
          <IconWrapper>
            <Icon id="heart" />
          </IconWrapper>
        </Text>
      </Container>
    </ChatLayout>
  );
}
