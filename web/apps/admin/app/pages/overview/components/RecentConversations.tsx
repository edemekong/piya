import { AppAvatar } from "@yinapp/ui";
import { recentConversations } from "../overview.mock";

export function RecentConversations() {
  return (
    <section className="rounded-md bg-white p-6 shadow-sm">
      <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
        Recent conversations
      </h2>
      <p className="mt-1 text-callout text-[#2F4B4F]/70">
        Latest customer messages.
      </p>

      <div className="mt-5 grid gap-2">
        {recentConversations.map((conversation) => (
          <div
            className="flex items-start gap-3 rounded-md border border-border bg-fill/40 p-3"
            key={`${conversation.contactName}-${conversation.time}`}
          >
            <AppAvatar className="size-9" name={conversation.contactName} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#2F4B4F]">
                {conversation.contactName}
              </p>
              <p className="mt-1 line-clamp-1 text-callout text-[#2F4B4F]/70">
                {conversation.lastMessage}
              </p>
              <p className="mt-2 text-footnote text-[#2F4B4F]/55">
                {conversation.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
