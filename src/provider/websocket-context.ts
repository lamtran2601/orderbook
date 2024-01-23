import { createContext } from "react";
import { Signal } from "@preact/signals-react";

export const WebSocketContext = createContext<
  [Signal<object | undefined>, Signal<WebSocket | undefined>]
>([new Signal(undefined), new Signal(undefined)]);
