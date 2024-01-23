export class WebsocketService {
  private socket: WebSocket;

  constructor(private url: string) {
    console.log("new WebsocketService");
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });

    this.socket.send(
      JSON.stringify({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      })
    );
  }

  send(message: string) {
    console.log("send", message);

    this.socket.send(message);
  }

  listen(callback: (event: MessageEvent) => void) {
    this.socket.addEventListener("message", callback);
  }

  close() {
    this.socket.close();
  }
}
