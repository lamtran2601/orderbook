import { WebSocketContext } from "@/provider/websocket-context";
import { useContext } from "react";

export const useWebsocket = () => {
  const context = useContext(WebSocketContext);
  return context;
};
