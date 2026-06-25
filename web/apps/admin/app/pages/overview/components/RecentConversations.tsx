import { recentConversations } from "../overview.mock";

export function RecentConversations() {
  return (
    <section className="flex h-full min-h-[360px] flex-col rounded-md bg-white p-6 shadow-sm">
      <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
        Recent conversations
      </h2>

      <div className="mt-5 grid gap-3">
        {recentConversations.map((conversation) => (
          <div
            className="w-full rounded-2xl rounded-tl-md bg-fill px-4 py-3"
            key={`${conversation.contactName}-${conversation.time}`}
          >
            <p className="text-caption-1 font-semibold text-[#2F4B4F]">
              {conversation.contactName}
            </p>
            <p className="mt-1 line-clamp-2 text-callout text-[#2F4B4F]/75">
              {conversation.lastMessage}
            </p>
            <p className="mt-2 text-footnote text-[#2F4B4F]/50">
              {conversation.time}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
