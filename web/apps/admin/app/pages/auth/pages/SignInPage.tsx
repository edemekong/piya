import { OnboadingSection, SignInForm } from "../components";

export function SignInPage() {
  return (
    <main className="h-screen overflow-hidden bg-primary text-foreground">
      <section className="grid h-full w-screen grid-cols-2">
        <OnboadingSection />

        <aside className="h-full p-4">
          <div className="flex h-full w-full items-center justify-start rounded-[32px] border border-secondary bg-white px-12 py-10 shadow-sm">
            <SignInForm />
          </div>
        </aside>
      </section>
    </main>
  );
}
