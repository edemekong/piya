import { Rocket } from "lucide-react";
import { Button } from "@piya/ui";

type SiteCanvasToolbarProps = {
  onPublish: () => void;
};

export function SiteCanvasToolbar({ onPublish }: SiteCanvasToolbarProps) {
  return (
    <div className="absolute left-6 right-6 top-6 z-20 flex items-center justify-between rounded-md border border-[#b8cdf8] bg-[#eaf2ff] px-5 py-4 text-[#1f5dc8] shadow-sm">
      <p className="text-headline font-semibold">Site has unpublished changes</p>
      <Button icon={<Rocket />} onClick={onPublish} type="button">
        Publish changes
      </Button>
    </div>
  );
}
