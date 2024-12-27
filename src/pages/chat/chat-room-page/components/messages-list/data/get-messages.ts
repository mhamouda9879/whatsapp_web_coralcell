import { Message } from "common/types/common.type";

export class MessageService {
  private apiUrl: string;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.apiUrl = "https://route.coralcell.com/b/api/messages.php";
  }

  // Fetch messages for a specific contact ID
  async fetchMessages(contactId: number): Promise<Message[]> {
    try {
      const response = await fetch(`${this.apiUrl}?contact_id=${contactId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const apiData = await response.json();

      if (!apiData.success || !Array.isArray(apiData.messages)) {
        throw new Error("Invalid API response format");
      }

      // Map the API response to the `Message` model
      return apiData.messages.map((item: any) => ({
        id: item.id.toString(),
        body: item.body || "No content",
        date: new Date(item.timestamp).toLocaleDateString(),
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
        messageStatus: item.direction === "outgoing" ? "SENT" : "RECEIVED",
        isOpponent: item.direction === "incoming",
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  // Start polling the API every 1 second
  startPollingMessages(contactId: number, callback: (messages: Message[]) => void): void {
    if (this.intervalId) {
      console.warn("Polling already in progress.");
      return;
    }

    this.intervalId = setInterval(async () => {
      const messages = await this.fetchMessages(contactId);
      callback(messages); // Send the messages to the callback function
    }, 1000); // Poll every 1 second
  }

  // Stop polling the API
  stopPollingMessages(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Polling stopped.");
    }
  }
}
