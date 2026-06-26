import { OnboadingSection, SignInForm } from "../components";
import { useAdminAuthRedirect } from "@/utils/use-admin-auth-redirect";

export function SignInPage() {
  const authStatus = useAdminAuthRedirect("guest");

  if (authStatus !== "ready") return null;

  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      <section className="grid h-full w-screen grid-cols-[65%_35%]">
        <OnboadingSection />

        <aside className="h-full p-screen">
          <div className="flex h-full w-full flex-col rounded-lg bg-white p-screen shadow-sm">
            <div className="flex flex-1 items-center justify-center">
              <SignInForm />
            </div>

            <p className="text-footnote leading-relaxed text-text-secondary">
              By signing in, you accept our{" "}
              <a
                className="font-semibold text-primary underline underline-offset-4"
                href="/privacy-policy"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                className="font-semibold text-primary underline underline-offset-4"
                href="/terms-of-use"
              >
                Terms of Use
              </a>
              .
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
