import { Mail, Phone } from "lucide-react";
import { ADMIN_ASSETS } from "@/utils/assets";
import type { CommunicationChannel } from "@piya/shared/types";

type CommunicationChannelIconProps = {
  channel: CommunicationChannel;
  className?: string;
};

export function CommunicationChannelIcon({
  channel,
  className = "size-4",
}: CommunicationChannelIconProps) {
  if (channel === "email") return <Mail className={className} />;
  if (channel === "sms") return <Phone className={className} />;

  return (
    <img
      alt=""
      aria-hidden="true"
      className={className}
      src={ADMIN_ASSETS.whatsappIcon}
    />
  );
}
