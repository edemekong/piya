import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "../lib/cn";

export type AppButtonState = "enabled" | "loading" | "disabled" | "loaded";

export const buttonVariants = cva(
  "inline-flex min-w-20 items-center justify-center gap-2 whitespace-nowrap rounded-md px-card text-headline font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-secondary text-primary hover:bg-secondary-dark",
        secondary:
          "bg-surface-tertiary text-foreground hover:bg-surface-secondary",
        destructive: "bg-error text-primary-foreground hover:bg-error/90",
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary/5",
        dotted:
          "border border-dashed border-primary bg-transparent text-primary hover:bg-primary/5",
        ghost: "text-foreground hover:bg-muted",
        link: "h-auto min-w-0 p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[50px]",
        sm: "h-10 px-3 text-callout",
        lg: "h-[52px]",
        icon: "size-10 min-w-0 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    buttonState?: AppButtonState;
    icon?: React.ReactNode;
    trailing?: React.ReactNode;
    loadingLabel?: string;
    onDisabledClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      buttonState = "enabled",
      icon,
      trailing,
      children,
      disabled,
      loadingLabel = "Loading",
      onClick,
      onDisabledClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isLoading = buttonState === "loading";
    const isDisabled = disabled || buttonState === "disabled" || isLoading;

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      if (isDisabled) {
        onDisabledClick?.(event);
        return;
      }

      onClick?.(event);
    }

    const content = isLoading ? (
      <>
        <span
          aria-hidden="true"
          className="size-[18px] animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        <span className="sr-only">{loadingLabel}</span>
      </>
    ) : (
      <>
        {icon}
        {children}
        {trailing}
      </>
    );

    return (
      <Comp
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={!asChild ? isDisabled : undefined}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {asChild && !isLoading && !icon && !trailing ? children : content}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export type AppButtonProps = Omit<ButtonProps, "variant" | "children"> & {
  title: React.ReactNode;
};

export function AppPrimaryButton({ title, ...props }: AppButtonProps) {
  return <Button {...props}>{title}</Button>;
}

export function AppSecondaryButton({ title, ...props }: AppButtonProps) {
  return (
    <Button variant="secondary" {...props}>
      {title}
    </Button>
  );
}

export function AppDestructiveButton({
  title,
  size = "lg",
  ...props
}: AppButtonProps) {
  return (
    <Button variant="destructive" size={size} {...props}>
      {title}
    </Button>
  );
}

export type AppOutlineButtonProps = AppButtonProps & {
  dotted?: boolean;
};

export function AppOutlineButton({
  title,
  dotted = false,
  ...props
}: AppOutlineButtonProps) {
  return (
    <Button variant={dotted ? "dotted" : "outline"} {...props}>
      {title}
    </Button>
  );
}

export type AppIconButtonProps = Omit<ButtonProps, "children" | "size"> & {
  icon: React.ReactNode;
  label: string;
};

export function AppIconButton({
  icon,
  label,
  className,
  variant = "secondary",
  ...props
}: AppIconButtonProps) {
  return (
    <Button
      aria-label={label}
      className={cn("bg-fill text-foreground", className)}
      size="icon"
      variant={variant}
      {...props}
    >
      {icon}
    </Button>
  );
}

export type AppBackButtonProps = Omit<ButtonProps, "children" | "icon"> & {
  text?: React.ReactNode;
};

export function AppBackButton({
  text = "Back",
  className,
  ...props
}: AppBackButtonProps) {
  return (
    <Button
      className={cn(
        "h-auto min-w-0 gap-element bg-transparent p-0 text-body font-normal text-text-secondary hover:bg-transparent hover:text-foreground",
        className,
      )}
      icon={<ArrowLeft className="size-6" />}
      variant="ghost"
      {...props}
    >
      {text}
    </Button>
  );
}

export type AppBackIconButtonProps = Omit<
  AppIconButtonProps,
  "icon" | "label"
> & {
  label?: string;
};

export function AppBackIconButton({
  label = "Go back",
  variant = "ghost",
  ...props
}: AppBackIconButtonProps) {
  return (
    <AppIconButton
      icon={<ArrowLeft className="size-6" />}
      label={label}
      variant={variant}
      {...props}
    />
  );
}

export type AppCloseButtonProps = Omit<AppIconButtonProps, "icon" | "label"> & {
  label?: string;
};

export function AppCloseButton({
  label = "Close",
  className,
  ...props
}: AppCloseButtonProps) {
  return (
    <AppIconButton
      className={cn("bg-unselected/20", className)}
      icon={<X />}
      label={label}
      {...props}
    />
  );
}

export type LinkedTextProps = {
  text?: React.ReactNode;
  link: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  center?: boolean;
  underline?: boolean;
  className?: string;
  linkClassName?: string;
  onLinkClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function LinkedText({
  text,
  link,
  icon,
  disabled = false,
  center = false,
  underline = false,
  className,
  linkClassName,
  onLinkClick,
}: LinkedTextProps) {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-1 text-footnote text-text-body",
        center && "justify-center text-center",
        className,
      )}
    >
      {icon ? <span className="inline-flex text-primary">{icon}</span> : null}
      {text ? <span>{text}</span> : null}
      <Button
        buttonState={disabled ? "disabled" : "enabled"}
        className={cn(
          "text-footnote font-medium",
          underline && "underline",
          linkClassName,
        )}
        onClick={onLinkClick}
        variant="link"
      >
        {link}
      </Button>
    </span>
  );
}
