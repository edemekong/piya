import { Activity, Boxes, ShieldCheck, Users } from "lucide-react";
import { Badge, Button } from "@1bee/ui";

const metrics = [
  { label: "Businesses", value: "0", icon: Boxes },
  { label: "Contacts", value: "0", icon: Users },
  { label: "Active modules", value: "0", icon: Activity },
];

export default function AdminIndex() {
  return (
    <main className="min-h-screen bg-muted/40">
      <section className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">1Bee</p>
            <h1 className="text-2xl font-semibold tracking-normal">Admin</h1>
          </div>
          <Badge>Internal</Badge>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Operations overview</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Manage platform businesses, modules, support tasks, and operational health.
            </p>
          </div>
          <Button>
            <ShieldCheck className="size-4" />
            Review access
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                className="rounded-md border border-border bg-background p-5"
                key={metric.label}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
