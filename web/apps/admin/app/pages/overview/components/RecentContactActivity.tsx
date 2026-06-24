import { Badge } from "@yinapp/ui";
import type { ContactData } from "@yinapp/shared/types";

export function RecentContactActivity({ contacts }: { contacts: ContactData[] }) {
  return (
    <section className="rounded-md bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
            Recent contact activity
          </h2>
          <p className="mt-1 text-callout text-[#2F4B4F]/70">
            Latest changes across your customer records.
          </p>
        </div>
        <Badge>Live</Badge>
      </div>

      <div className="mt-6 grid gap-3">
        {contacts.slice(0, 3).map((contact) => (
          <div
            className="flex items-center justify-between rounded-md border border-border bg-fill/50 px-4 py-3"
            key={contact.id}
          >
            <div>
              <p className="font-semibold text-[#2F4B4F]">{contact.name}</p>
              <p className="text-footnote text-[#2F4B4F]/65">{contact.code}</p>
            </div>
            <p className="text-footnote text-[#2F4B4F]/65">
              {formatDate(contact.lastInteractionAt)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}
