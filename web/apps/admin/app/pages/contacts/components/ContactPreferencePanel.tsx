import * as React from "react";
import { Mail, MessageSquare, Pencil } from "lucide-react";
import { Badge, SectionHeader } from "@piya/ui";
import {
  showToast,
  useUpdateContactMutation,
  type AppDispatch,
} from "@piya/shared";
import type { ContactData } from "@piya/shared/models";
import { useDispatch } from "react-redux";
import { ADMIN_ASSETS } from "@/utils/assets";

type PreferenceChannel = "email" | "sms" | "whatsapp";
type PreferenceValues = Record<PreferenceChannel, boolean>;
type PreferenceField =
  | "emailEnabled"
  | "smsEnabled"
  | "whatsappEnabled";

const preferenceFieldByChannel = {
  email: "emailEnabled",
  sms: "smsEnabled",
  whatsapp: "whatsappEnabled",
} satisfies Record<PreferenceChannel, PreferenceField>;

export function ContactPreferencePanel({
  contact,
  onContactUpdated,
}: {
  contact: ContactData;
  onContactUpdated?: (contact: ContactData) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [updateContact, { isLoading: isUpdatingPreference }] =
    useUpdateContactMutation();
  const [preferences, setPreferences] = React.useState<PreferenceValues>({
    email: contact.preference.emailEnabled,
    sms: contact.preference.smsEnabled,
    whatsapp: contact.preference.whatsappEnabled,
  });
  const [editingChannel, setEditingChannel] =
    React.useState<PreferenceChannel | null>(null);

  React.useEffect(() => {
    setPreferences({
      email: contact.preference.emailEnabled,
      sms: contact.preference.smsEnabled,
      whatsapp: contact.preference.whatsappEnabled,
    });
    setEditingChannel(null);
  }, [
    contact.id,
    contact.preference.emailEnabled,
    contact.preference.smsEnabled,
    contact.preference.whatsappEnabled,
  ]);

  async function togglePreference(channel: PreferenceChannel) {
    if (isUpdatingPreference) return;

    const nextPreferences = {
      ...preferences,
      [channel]: !preferences[channel],
    };
    setPreferences(nextPreferences);

    try {
      const updatedContact = await updateContact({
        contactId: contact.id,
        input: {
          preference: {
            [preferenceFieldByChannel[channel]]: nextPreferences[channel],
          },
        },
      }).unwrap();
      onContactUpdated?.(updatedContact);
    } catch (error) {
      setPreferences(preferences);
      showToast(dispatch, {
        message:
          error instanceof Error
            ? error.message
            : "Preference update failed",
        title: "Could not save preference",
        variant: "error",
      });
    }
  }

  const preferenceCards = [
    {
      channel: "email",
      icon: <Mail className="size-4" />,
      label: "Email",
    },
    {
      channel: "sms",
      icon: <MessageSquare className="size-4" />,
      label: "SMS",
    },
    {
      channel: "whatsapp",
      icon: (
        <img
          alt=""
          className="size-4 object-contain"
          src={ADMIN_ASSETS.whatsappIcon}
        />
      ),
      label: "WhatsApp",
    },
  ] satisfies {
    channel: PreferenceChannel;
    icon: React.ReactNode;
    label: string;
  }[];

  return (
    <div className="grid gap-4">
      <SectionHeader
        description="Channel settings and message exclusions for this contact."
        title="Preferences"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {preferenceCards.map((preference) => (
          <div
            className="rounded-md border border-border bg-fill/40 px-4 pb-3 pt-4"
            key={preference.label}
          >
            <div className="flex items-center gap-2 text-footnote font-normal text-[#2F4B4F]/65">
              {preference.icon}
              {preference.label}
            </div>
            <div className="mt-2 flex h-10 items-center justify-between gap-3">
              <p className="text-headline font-semibold leading-none text-[#2F4B4F]">
                {preferences[preference.channel] ? "Enabled" : "Disabled"}
              </p>
              {editingChannel === preference.channel ? (
                <button
                  aria-checked={preferences[preference.channel]}
                  aria-label={`Toggle ${preference.label} preference`}
                  className="inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-[#2F4B4F]/20 p-1 transition-colors data-[checked=true]:bg-primary"
                  data-checked={preferences[preference.channel]}
                  disabled={isUpdatingPreference}
                  onClick={() => togglePreference(preference.channel)}
                  role="switch"
                  type="button"
                >
                  <span
                    className="size-5 rounded-full bg-white shadow-sm transition-transform data-[checked=true]:translate-x-5"
                    data-checked={preferences[preference.channel]}
                  />
                </button>
              ) : (
                <button
                  aria-label={`Edit ${preference.label} preference`}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#2F4B4F]/45 transition hover:bg-white hover:text-[#2F4B4F]"
                  onClick={() =>
                    setEditingChannel((current) =>
                      current === preference.channel
                        ? null
                        : preference.channel,
                    )
                  }
                  type="button"
                >
                  <Pencil className="size-3.5" />
                </button>
              )}
            </div>
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
