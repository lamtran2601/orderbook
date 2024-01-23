import { WebSocketContext } from "@/provider/websocket-context";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import { ReactElement } from "react";

const DELAY = 1000;

export const WebsocketProvider = ({ children }: { children: ReactElement }) => {
  const message = useSignal(undefined);
  const ws = useSignal<WebSocket | undefined>(undefined);

  let lastTime = new Date().getTime();

  useSignalEffect(() => {
    if (!import.meta.env.VITE_WS_URL) {
      return;
    }

    const socket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.onmessage = (e) => {
      if (lastTime + DELAY > new Date().getTime()) {
        return;
      }
      lastTime = new Date().getTime();
      try {
        if (e.type !== "message" || !e.data) return;
        message.value = JSON.parse(e.data);
      } catch (e) {
        console.error(e);
      }
    };
    ws.value = socket;

    return () => socket.close();
  });

  return (
    <WebSocketContext.Provider value={[message, ws]}>
      {children}
    </WebSocketContext.Provider>
  );
};
