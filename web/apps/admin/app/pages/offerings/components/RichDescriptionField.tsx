import * as React from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Sparkles,
  Strikethrough,
  Underline,
} from "lucide-react";
import { Button } from "@piya/ui";

type DescriptionToolbarAction = {
  command: string;
  icon: typeof Bold;
  label: string;
  value?: string;
};

const descriptionToolbarActions: DescriptionToolbarAction[] = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "underline", icon: Underline, label: "Underline" },
  { command: "strikeThrough", icon: Strikethrough, label: "Strikethrough" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
  { command: "insertUnorderedList", icon: List, label: "Bullet list" },
  { command: "formatBlock", icon: Quote, label: "Quote", value: "blockquote" },
];

function RichDescriptionField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const editorRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== value) {
      editorRef.current.innerText = value;
    }
  }, [value]);

  function applyCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerText ?? "");
  }

  return (
    <div className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <div className="overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
        <div className="relative min-h-32 px-3 py-3">
          {!value ? (
            <span className="pointer-events-none absolute left-3 top-3 text-callout text-[#2F4B4F]/35">
              Start typing...
            </span>
          ) : null}
          <div
            aria-label={label}
            className="prose prose-sm min-h-24 max-w-none text-callout leading-relaxed text-[#2F4B4F] outline-none [&_blockquote]:border-l-2 [&_blockquote]:border-primary/35 [&_blockquote]:pl-3 [&_blockquote]:text-[#2F4B4F]/70 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            contentEditable
            onInput={() => onChange(editorRef.current?.innerText ?? "")}
            ref={editorRef}
            role="textbox"
            suppressContentEditableWarning
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 border-t border-border bg-white px-2 py-2">
          {descriptionToolbarActions.map((action, index) => (
            <React.Fragment key={`${action.command}-${action.label}`}>
              {index === 4 || index === 6 ? (
                <span className="mx-1 h-7 border-l border-border" />
              ) : null}
              <DescriptionToolbarButton
                action={action}
                onApply={applyCommand}
              />
            </React.Fragment>
          ))}
          <Button
            className="ml-auto h-9 rounded-sm"
            icon={<Sparkles className="size-4" />}
            size="sm"
            type="button"
            variant="outline"
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}

function DescriptionToolbarButton({
  action,
  onApply,
}: {
  action: DescriptionToolbarAction;
  onApply: (command: string, value?: string) => void;
}) {
  const Icon = action.icon;

  return (
    <span className="group relative inline-flex">
      <button
        aria-label={action.label}
        className="inline-flex size-9 items-center justify-center rounded-sm text-[#202829] transition hover:bg-fill"
        onMouseDown={(event) => {
          event.preventDefault();
          onApply(action.command, action.value);
        }}
        title={action.label}
        type="button"
      >
        <Icon className="size-4" strokeWidth={3} />
      </button>
      <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#102A2D] px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
        {action.label}
      </span>
    </span>
  );
}

export { RichDescriptionField };
