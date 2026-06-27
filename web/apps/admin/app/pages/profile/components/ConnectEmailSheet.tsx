import * as React from "react";
import {
  getBusinessSlug,
  type AccountSetupEmailIntegrationInput,
} from "@piya/shared";
import { AppSheet, AppTextField, Button } from "@piya/ui";

type ConnectEmailSheetProps = {
  initialFromEmailLocalPart: string;
  initialReplyToEmail: string;
  onClose: () => void;
  onConnect: (input: AccountSetupEmailIntegrationInput) => void;
  open: boolean;
};

function ConnectEmailSheet({
  initialFromEmailLocalPart,
  initialReplyToEmail,
  onClose,
  onConnect,
  open,
}: ConnectEmailSheetProps) {
  const [fromEmailLocalPart, setFromEmailLocalPart] = React.useState(
    initialFromEmailLocalPart,
  );
  const [replyToEmail, setReplyToEmail] = React.useState(initialReplyToEmail);

  React.useEffect(() => {
    if (!open) return;

    setFromEmailLocalPart(initialFromEmailLocalPart);
    setReplyToEmail(initialReplyToEmail);
  }, [initialFromEmailLocalPart, initialReplyToEmail, open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFromEmailLocalPart = getBusinessSlug(fromEmailLocalPart);
    if (!nextFromEmailLocalPart || !replyToEmail.trim()) return;

    onConnect({
      fromEmailLocalPart: nextFromEmailLocalPart,
      replyToEmail: replyToEmail.trim().toLowerCase(),
    });
    onClose();
  }

  return (
    <AppSheet
      ariaLabel="connect email"
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="connect-email-form" type="submit">
            Connect email
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Connect email"
    >
      <form
        className="grid gap-5"
        id="connect-email-form"
        onSubmit={handleSubmit}
      >
        <AppTextField
          label="From"
          maxLength={55}
          onChange={(event) =>
            setFromEmailLocalPart(getBusinessSlug(event.target.value))
          }
          required
          suffix={
            <span className="flex items-center border-l border-border px-3 text-callout text-[#2F4B4F]/65">
              @mail.piya.store
            </span>
          }
          value={fromEmailLocalPart}
        />

        <AppTextField
          label="Reply-to"
          onChange={(event) => setReplyToEmail(event.target.value)}
          required
          type="email"
          value={replyToEmail}
        />
      </form>
    </AppSheet>
  );
}

export { ConnectEmailSheet };
export type { ConnectEmailSheetProps };
