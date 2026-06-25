import { ArrowRight, PackageCheck, Truck, Users } from "lucide-react";
import { Badge, Button } from "@piya/ui";

const modules = [
  { title: "Contacts", detail: "Keep customers, leads, and vendors organized.", icon: Users },
  { title: "Orders", detail: "Track goods, services, and customer requests.", icon: PackageCheck },
  { title: "Logistics", detail: "Assign riders and follow deliveries in one board.", icon: Truck },
];

export default function PortalIndex() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              1B
            </div>
            <div>
              <p className="text-sm font-medium">Piya</p>
              <p className="text-xs text-muted-foreground">Business portal</p>
            </div>
          </div>
          <Badge>Workspace</Badge>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Modular business operations</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Manage customers, work, and services from one focused workspace.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            This portal will hold contacts, orders, staff, delivery workflows, and business add-ons.
          </p>
          <div className="mt-6">
            <Button>
              Open workspace
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article
                className="rounded-md border border-border bg-muted/30 p-5"
                key={module.title}
              >
                <Icon className="size-5 text-primary" />
                <h2 className="mt-4 text-base font-semibold">{module.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.detail}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
