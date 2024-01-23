import { OrderBook } from "@/components/order-book";
import { WebsocketProvider } from "@/provider/websocket-provider";

function App() {
  return (
    <>
      <WebsocketProvider>
        <OrderBook />
      </WebsocketProvider>
    </>
  );
}

export default App;
