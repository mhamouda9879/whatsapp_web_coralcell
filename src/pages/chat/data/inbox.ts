import { Inbox } from "common/types/common.type";

export class InboxService {
  private apiUrl: string;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.apiUrl = "https://route.coralcell.com/b/api/contacts.php";
  }

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
        image: "/assets/images/default.jpeg", 
        lastMessage: item.last_message_body || "No messages yet", 
        notificationsCount: 0, 
        messageStatus: item.last_message_direction === "outgoing" ? "SENT" : "RECEIVED", // حالة الرسالة
        timestamp: item.last_message_timestamp || item.created_at || undefined, // التوقيت
        isPinned: false, // قيمة افتراضية للتثبيت
        isOnline: false, // قيمة افتراضية للاتصال
      }));

      // ترتيب الرسائل حسب توقيت آخر رسالة
      inbox = inbox.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0; // تاريخ الرسالة الأولى
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0; // تاريخ الرسالة الثانية
        return dateB - dateA; // ترتيب تنازلي
      });

      return inbox;
    } catch (error) {
      console.error("Error fetching inbox data:", error);
      return []; // في حالة الخطأ، يرجع مصفوفة فارغة
    }
  }

  // تشغيل استدعاء الـ API كل ثانية
  startRefreshingInboxData(callback: (inbox: Inbox[]) => void) {
    if (this.intervalId) {
      console.warn("Refreshing loop already running");
      return;
    }

    this.intervalId = setInterval(async () => {
      const inbox = await this.fetchInboxData();
      callback(inbox); // يتم إرسال البيانات إلى الكولباك
    }, 1000); // يتم الاستدعاء كل ثانية
  }

  // إيقاف التحديث
  stopRefreshingInboxData() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Stopped refreshing inbox data");
    }
  }
}
