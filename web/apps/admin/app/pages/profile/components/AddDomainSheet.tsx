import * as React from "react";
import { AppSheet, Button } from "@piya/ui";

type AddDomainSheetProps = {
  onClose: () => void;
  open: boolean;
};

function AddDomainSheet({ onClose, open }: AddDomainSheetProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onClose();
  }

  return (
    <AppSheet
      ariaLabel="add domain"
      description="Use your own domain for your customer portal, so customers can open your business at your website instead of a Piya link."
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="add-domain-form" type="submit">
            Add domain
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Add domain"
    >
      <form className="grid gap-5" id="add-domain-form" onSubmit={handleSubmit}>
        <label className="grid gap-2">
          <span className="text-footnote font-semibold text-[#2F4B4F]">
            Domain
          </span>
          <input
            className="h-12 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
            name="domain"
            placeholder="Enter domain"
            required
            type="text"
          />
        </label>

        <div className="rounded-md border border-border bg-fill p-4">
          <p className="font-semibold text-[#2F4B4F]">What happens next</p>
          <p className="mt-1 text-callout text-[#2F4B4F]/65">
            We will give you a short DNS record to add where your domain is
            managed. After it is approved, your customer portal will open at
            this domain.
          </p>
          <p className="mt-3 text-callout text-[#2F4B4F]/65">
            Customers can use{" "}
            <span className="font-semibold text-[#2F4B4F]">
              https://yourbusiness.com
            </span>{" "}
            instead of{" "}
            <span className="font-semibold text-[#2F4B4F]">
              https://piya.store/your-business
            </span>
          </p>
        </div>
      </form>
    </AppSheet>
  );
}

export { AddDomainSheet };
