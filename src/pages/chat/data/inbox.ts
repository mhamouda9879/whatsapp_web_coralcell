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
    // Return the appropriate image URL based on the current theme
    return this.theme.mode === "light"
      ? "/assets/images/coralcell_light.png"
      : "/assets/images/coralcell_dark.png";
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

      // Map API data to the `Inbox` type
      const inbox: Inbox[] = apiData.contacts.map((item: any) => ({
        id: item.id ? item.id.toString() : "None", // Convert ID to string
        name: item.wa_id || "Unknown", // Use WhatsApp ID as the name
        image: this.getImageURL(), // Dynamically set the image based on the theme
        lastMessage: item.last_message_body || "No messages yet", // Last message or default message
        notificationsCount: item.is_live_agent_requested === 0 ? 0 : 10, // Notification count
        messageStatus:
          item.last_message_direction === "outgoing" ? "SENT" : "RECEIVED", // Message direction
        timestamp: item.last_message_timestamp || item.created_at || undefined, // Timestamp
        isPinned: false, // Default value for pinned
        isOnline: false, // Default value for online status
        isRobot: item.is_live_agent_requested === 0 ? 0 : 1, // Determine if it's a robot
      }));

      // Sort inbox data: live agents (isRobot = 1) first, then by timestamp in descending order
      return inbox.sort((a, b) => {
        // Explicitly type `isRobotA` and `isRobotB` as numbers
        const isRobotA: number = typeof a.isRobot === "boolean" ? (a.isRobot ? 1 : 0) : a.isRobot ?? 0;
        const isRobotB: number = typeof b.isRobot === "boolean" ? (b.isRobot ? 1 : 0) : b.isRobot ?? 0;

        // Sort by `isRobot` first (1 for live agents on top)
        if (isRobotB !== isRobotA) {
          return isRobotB - isRobotA; // Live agents (1) come before robots (0)
        }

        // If `isRobot` is the same, sort by timestamp in descending order
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA; // Newer messages first
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

    // Start periodic data refresh
    this.intervalId = setInterval(async () => {
      const inbox = await this.fetchInboxData();
      callback(inbox);
    }, 1000); // Refresh every second
  }

  stopRefreshingInboxData(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Stopped refreshing inbox data");
    }
  }
}
