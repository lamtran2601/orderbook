import { useWebsocket } from "@/hooks/use-websocket";
import { untracked, useSignal, useSignalEffect } from "@preact/signals-react";
import { useCallback, useEffect } from "react";

type FeedMessage = {
  bids: [number, number][];
  asks: [number, number][];
};

export const useOrderBook = () => {
  const [message, ws] = useWebsocket();

  const group = useSignal(0.5);
  const lastProduct = useSignal("PI_XBTUSD");
  const product = useSignal("PI_XBTUSD");
  const data = useSignal<FeedMessage>({
    bids: [],
    asks: [],
  });

  const send = useCallback(
    (event: "subscribe" | "unsubscribe", product: string) => {
      console.log("sending", event, product);
      return ws.value?.send(
        JSON.stringify({
          event,
          feed: "book_ui_1",
          product_ids: [product],
        })
      );
    },
    [ws.value]
  );

  useEffect(() => {
    if (!ws.value) return;
    const sendSubscribe = () => {
      send("unsubscribe", lastProduct.value);
      data.value = {
        bids: [],
        asks: [],
      };
      send("subscribe", product.value);
      lastProduct.value = product.value;
    };

    if (ws.value.readyState !== WebSocket.OPEN) {
      ws.value.onopen = () => {
        console.log("ws.value.onopen");
        sendSubscribe();
      };
    } else {
      sendSubscribe();
    }
  }, [ws.value, product.value, send, lastProduct.value]);

  useSignalEffect(() => {
    if (!message.value) return;
    const {
      bids = [],
      asks = [],
      product_id,
    } = (message.value ?? {}) as {
      bids: [number, number][];
      asks: [number, number][];
      product_id: string;
    };
    if (product_id !== product.value) return;
    const oldData = untracked(() => data.value);

    data.value = {
      bids: sortPrices(
        [
          ...oldData.bids.filter(
            ([price]) =>
              !bids.some((bid) => Math.abs(bid[0] - price) < group.value)
          ),
          ...bids.filter(([, size]) => size > 0),
        ],
        {
          group: group.value,
          sort: "asc",
          slice: 15,
        }
      ),
      asks: sortPrices(
        [
          ...oldData.asks.filter(
            ([price]) =>
              !asks.some((ask) => Math.abs(ask[0] - price) < group.value)
          ),
          ...asks.filter(([, size]) => size > 0),
        ],
        {
          group: group.value,
          slice: 15,
          sort: "desc",
        }
      ),
    };
  });

  return { data, product, group };
};

const sortPrices = (
  prices: [number, number][],
  {
    group = 0.5,
    sort = "asc",
    slice = 25,
  }: {
    group?: number;
    sort?: "asc" | "desc";
    slice?: number;
  }
) => {
  return prices
    .sort(([a], [b]) =>
      sort === "asc" ? Number(b) - Number(a) : Number(a) - Number(b)
    )
    .reduce((acc, [price, size], index) => {
      if (index === 0 || acc.length === 0) {
        return [[price, size] as [number, number]];
      }
      const last = acc[acc.length - 1];

      if (last && Math.abs(last[0] - price) >= group) {
        acc.push([price, size]);
      }
      return acc;
    }, [] as [number, number][])
    .slice(0, slice);
};
