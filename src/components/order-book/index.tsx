import { GroupMenu } from "@/components/order-book/group-menu";
import { PriceList } from "@/components/order-book/price-list";
import { ProductMenu } from "@/components/order-book/product-menu";
import { useOrderBook } from "@/hooks/use-order-book";

export const OrderBook = () => {
  const { data } = useOrderBook();

  return (
    <div className="p-4">
      <div className="flex justify-between py-3">
        <h1 className="text-2xl">OrderBook</h1>
        <ProductMenu />
        <GroupMenu />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PriceList data={data.value.bids} />
        <PriceList data={data.value.asks} />
      </div>
    </div>
  );
};
