import { Badge } from "@yinapp/ui";
import { productPerformance } from "../overview.mock";

export function ProductPerformance() {
  return (
    <section className="rounded-md bg-white p-6 shadow-sm">
      <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
        Product performance
      </h2>
      <p className="mt-1 text-callout text-[#2F4B4F]/70">
        Best performing products from recent sales.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-caption-1 uppercase text-[#2F4B4F]/60">
              <th className="py-3 pr-4 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Revenue</th>
              <th className="px-4 py-3 font-semibold">Sold</th>
              <th className="py-3 pl-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {productPerformance.map((product) => (
              <tr className="border-b border-border last:border-0" key={product.name}>
                <td className="py-4 pr-4 font-semibold text-[#2F4B4F]">
                  {product.name}
                </td>
                <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                  {formatMoney(product.revenue)}
                </td>
                <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                  {product.sold}
                </td>
                <td className="py-4 pl-4">
                  <Badge>{product.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
