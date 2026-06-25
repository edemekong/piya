import { MessageCircle, Send } from "lucide-react";
import { Button, EmptyState } from "@piya/ui";

export function ContactConversationsPanel() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-col overflow-hidden bg-fill/30">
      <div className="flex flex-1 items-center justify-center p-6 text-center">
        <EmptyState
          className="border-0 bg-transparent p-0 text-center"
          description="Chat bubbles will appear here when conversations are connected."
          icon={<MessageCircle className="size-5" />}
          title="No messages yet"
        />
      </div>

      <div className="flex items-center gap-3 bg-white p-4">
        <input
          className="h-11 flex-1 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
          placeholder="Type a message"
          type="text"
        />
        <Button aria-label="Send message" size="icon">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
