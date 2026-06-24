import { Badge, SectionHeader } from "@yinapp/ui";
import type { ContactData } from "@yinapp/shared/types";

export function ContactPreferencePanel({ contact }: { contact: ContactData }) {
  const preferences = [
    { label: "Email", enabled: contact.preference.emailEnabled },
    { label: "SMS", enabled: contact.preference.smsEnabled },
    { label: "WhatsApp", enabled: contact.preference.whatsappEnabled },
  ];

  return (
    <div className="grid gap-4">
      <SectionHeader
        description="Channel settings and message exclusions for this contact."
        title="Preferences"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {preferences.map((preference) => (
          <div
            className="rounded-md border border-border bg-fill/40 p-4"
            key={preference.label}
          >
            <p className="text-footnote text-[#2F4B4F]/65">{preference.label}</p>
            <p className="mt-2 text-headline font-semibold text-[#2F4B4F]">
              {preference.enabled ? "Enabled" : "Disabled"}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-border p-4">
        <p className="text-headline font-semibold text-[#2F4B4F]">
          Unsubscribed email types
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {contact.preference.unsubscribedEmailTypes.length ? (
            contact.preference.unsubscribedEmailTypes.map((type) => (
              <Badge key={type}>{type.replaceAll("_", " ")}</Badge>
            ))
          ) : (
            <p className="text-callout text-[#2F4B4F]/65">No exclusions set.</p>
          )}
        </div>
      </div>
    </div>
  );
}
