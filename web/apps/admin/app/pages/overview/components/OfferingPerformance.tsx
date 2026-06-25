import { Badge } from "@yinapp/ui";
import { formatMoney } from "@yinapp/shared/utils";
import { productPerformance } from "../overview.mock";

const topOfferings = productPerformance.slice(0, 4);

export function OfferingPerformance() {
  return (
    <section className="flex h-full min-h-[360px] flex-col rounded-md bg-white p-6 shadow-sm">
      <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
        Offering performance
      </h2>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-caption-1 uppercase text-[#2F4B4F]/60">
              <th className="py-3 pr-4 font-semibold">Offering</th>
              <th className="px-4 py-3 font-semibold">Revenue</th>
              <th className="px-4 py-3 font-semibold">Sold</th>
              <th className="py-3 pl-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {topOfferings.map((product) => (
              <tr
                className="border-b border-border last:border-0"
                key={product.name}
              >
                <td className="py-3 pr-4 font-semibold text-[#2F4B4F]">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-callout text-[#2F4B4F]/75">
                  {formatMoney(product.revenue)}
                </td>
                <td className="px-4 py-3 text-callout text-[#2F4B4F]/75">
                  {product.sold}
                </td>
                <td className="py-3 pl-4">
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
