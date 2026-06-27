import * as React from "react";
import { getBusinessSlug } from "@piya/shared";
import {
  AppSheet,
  AppTextField,
  Button,
  SegmentedTabs,
} from "@piya/ui";

type DomainTab = "piya-subdomain" | "custom-domain";

type ConnectDomainSheetProps = {
  initialSlug: string;
  onClose: () => void;
  onConnect: (slug: string) => void;
  open: boolean;
};

const domainTabs = [
  { label: "Piya Sub-Domain", value: "piya-subdomain" },
  { disabled: true, label: "Custom Domain", value: "custom-domain" },
] satisfies {
  disabled?: boolean;
  label: string;
  value: DomainTab;
}[];

function ConnectDomainSheet({
  initialSlug,
  onClose,
  onConnect,
  open,
}: ConnectDomainSheetProps) {
  const [activeTab, setActiveTab] = React.useState<DomainTab>("piya-subdomain");
  const [slug, setSlug] = React.useState(initialSlug);

  React.useEffect(() => {
    if (!open) return;

    setActiveTab("piya-subdomain");
    setSlug(initialSlug);
  }, [initialSlug, open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextSlug = getBusinessSlug(slug);
    if (!nextSlug) return;

    onConnect(nextSlug);
    onClose();
  }

  return (
    <AppSheet
      ariaLabel="connect domain"
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="connect-domain-form" type="submit">
            Connect domain
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Connect domain"
    >
      <form
        className="grid gap-5"
        id="connect-domain-form"
        onSubmit={handleSubmit}
      >
        <SegmentedTabs
          items={domainTabs}
          onValueChange={setActiveTab}
          value={activeTab}
        />

        <AppTextField
          label="Piya sub-domain"
          maxLength={55}
          onChange={(event) => setSlug(getBusinessSlug(event.target.value))}
          required
          suffix={
            <span className="flex items-center border-l border-border px-3 text-callout text-[#2F4B4F]/65">
              .piya.store
            </span>
          }
          value={slug}
        />

        <ul className="list-disc pl-5 text-callout text-[#2F4B4F]/65">
          <li>
            You will also have{" "}
            <span className="font-semibold text-[#2F4B4F]">
              https://piya.store/{slug || "name"}
            </span>
          </li>
        </ul>
      </form>
    </AppSheet>
  );
}

export { ConnectDomainSheet };
export type { ConnectDomainSheetProps };
