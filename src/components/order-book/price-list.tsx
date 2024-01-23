import { PriceTable } from "@/components/order-book/price-table";
import { ColumnDef } from "@tanstack/react-table";

type PriceListProps = {
  data: [number, number][];
};

export type Price = {
  id: string;
  total: string;
  size: string;
  price: string;
};

const columns: ColumnDef<Price>[] = [
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];

export const PriceList = ({ data }: PriceListProps) => {
  const priceTableData = data
    .reduce((acc, [price, size]) => {
      return [
        ...acc,
        {
          id: `${price}`,
          total: (acc[acc.length - 1]?.total ?? 0) + size,
          size: size.toLocaleString("en-US", { maximumFractionDigits: 2 }),
          price: price.toLocaleString("en-US", { maximumFractionDigits: 2 }),
        },
      ];
    }, [] as Price[])
    .map((price) => ({
      ...price,
      total: Number(price.total).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      }),
    }));
  return <PriceTable columns={columns} data={priceTableData} />;
};
