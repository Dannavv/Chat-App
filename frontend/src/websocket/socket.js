import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (userId, onMessage) => {
  if (stompClient?.connected) return;

  const token = localStorage.getItem("token");

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_WS_BASE_URL}/ws`),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,
    debug: () => {},

    onConnect: () => {
      console.log("✅ WS connected as", userId);

      stompClient.subscribe(`/topic/chat/${userId}`, (frame) => {
        onMessage(JSON.parse(frame.body));
      });
    },
  });

  stompClient.activate();
};

export const sendSocketMessage = ({ senderId, receiverId, content }) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("⚠️ WS not connected");
    return;
  }

  if (!receiverId || !content?.trim()) {
    console.error("❌ Invalid WS payload", { receiverId, content });
    return;
  }

  const payload = {
    senderId,
    receiverId,
    content: content.trim(),
  };

  console.log("📤 WS SEND →", payload);

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(payload),
  });
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
