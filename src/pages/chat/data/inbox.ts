import { Inbox } from "common/types/common.type";
import { useAppTheme } from "common/theme";

export class InboxService {
  private apiUrl: string;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.apiUrl = "https://route.coralcell.com/b/api/contacts.php";
  }

  theme = useAppTheme();

  getImageURL = (): string => {
    const baseUrl = process.env.PUBLIC_URL || "";
    return this.theme.mode === "light"
      ? `${baseUrl}/assets/images/coralcell_light.png`
      : `${baseUrl}/assets/images/coralcell_dark.png`;
  };
  

  async fetchInboxData(): Promise<Inbox[]> {
    try {
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const apiData = await response.json();

      if (!apiData.success || !Array.isArray(apiData.contacts)) {
        throw new Error("Invalid API response format");
      }

      const inbox: Inbox[] = apiData.contacts.map((item: any) => ({
        id: item.id ? item.id.toString() : "None",
        name: item.wa_id || "Unknown",
        image: this.getImageURL(),
        lastMessage: item.last_message_body || "No messages yet",
        notificationsCount: item.is_live_agent_requested === 0 ? 0 : 10,
        messageStatus:
          item.last_message_direction === "outgoing" ? "SENT" : "RECEIVED",
        timestamp: item.last_message_timestamp || item.created_at || undefined,
        isPinned: false,
        isOnline: false,
        isRobot: item.is_live_agent_requested === 0 ? 0 : 1,
      }));

      return inbox.sort((a, b) => {
        const isRobotA: number = typeof a.isRobot === "boolean" ? (a.isRobot ? 1 : 0) : a.isRobot ?? 0;
        const isRobotB: number = typeof b.isRobot === "boolean" ? (b.isRobot ? 1 : 0) : b.isRobot ?? 0;

        if (isRobotB !== isRobotA) {
          return isRobotB - isRobotA; 
        }

        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA; 
      });
    } catch (error) {
      console.error("Error fetching inbox data:", error);
      return [];
    }
  }

  startRefreshingInboxData(callback: (inbox: Inbox[]) => void): void {
    if (this.intervalId) {
      console.warn("Refreshing loop already running");
      return;
    }

    this.intervalId = setInterval(async () => {
      const inbox = await this.fetchInboxData();
      callback(inbox);
    }, 1000);
  }

  stopRefreshingInboxData(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Stopped refreshing inbox data");
    }
  }
}
