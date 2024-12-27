import { Inbox } from "common/types/common.type";
import { useAppTheme } from "common/theme";

export class InboxService {
  private apiUrl: string;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.apiUrl = "https://route.coralcell.com/b/api/contacts.php";
  }

  theme = useAppTheme();

  getImageURL = () => {
    if (this.theme.mode === "light") return "/assets/images/coralcell_light.png";
    return "/assets/images/coralcell_dark.png";
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

      let inbox: Inbox[] = apiData.contacts.map((item: any) => ({
        id: item.id ? item.id.toString() : "None",
        name: item.wa_id || "Unknown",
        image: this.getImageURL(),
        lastMessage: item.last_message_body || "No messages yet",
        notificationsCount: item.is_live_agent_requested == 0 ? 0 : 10,
        messageStatus: item.last_message_direction === "outgoing" ? "SENT" : "RECEIVED",
        timestamp: item.last_message_timestamp || item.created_at || undefined,
        isPinned: false,
        isOnline: false,
      }));


      inbox = inbox.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      });

      return inbox;
    } catch (error) {
      console.error("Error fetching inbox data:", error);
      return [];
    }
  }

  startRefreshingInboxData(callback: (inbox: Inbox[]) => void) {
    if (this.intervalId) {
      console.warn("Refreshing loop already running");
      return;
    }

    this.intervalId = setInterval(async () => {
      const inbox = await this.fetchInboxData();
      callback(inbox);
    }, 1000);
  }

  stopRefreshingInboxData() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Stopped refreshing inbox data");
    }
  }
}
