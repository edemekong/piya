import * as React from "react";
import { Sparkles } from "lucide-react";
import { AppTextareaField, Button } from "@piya/ui";

function AiOfferingPanel({ label }: { label: string }) {
  const [prompt, setPrompt] = React.useState("");

  return (
    <div className="grid gap-4">
      <AppTextareaField
        label={`Describe your ${label}`}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder={`Enter ${label} details to generate`}
        value={prompt}
      />
      <Button
        className="justify-self-start"
        icon={<Sparkles />}
        type="button"
        variant="outline"
      >
        Generate draft
      </Button>
    </div>
  );
}

export { AiOfferingPanel };
