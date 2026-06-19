import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, Search, CreditCard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold">BuzzAlert</span>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Never miss a mention on Reddit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            BuzzAlert monitors Reddit for your target keywords and sends you
            real-time email alerts. Perfect for indie hackers, marketers, and
            founders.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Start Monitoring Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Track Keywords</h3>
              <p className="text-sm text-muted-foreground">
                Set up keywords relevant to your business or interests.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Get Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Receive email notifications within minutes of a match.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Free to Start</h3>
              <p className="text-sm text-muted-foreground">
                3 free keywords. Upgrade when you need more.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Pricing</h2>
          <p className="text-muted-foreground mb-8">
            Simple, transparent pricing. Pay with Paystack.
          </p>
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <div className="rounded-lg border p-6 text-left">
              <h3 className="font-semibold text-lg">Starter</h3>
              <p className="text-3xl font-bold mt-2">$15</p>
              <p className="text-sm text-muted-foreground mb-4">per month</p>
              <ul className="space-y-2 text-sm">
                <li>✓ Up to 25 keywords</li>
                <li>✓ Email alerts</li>
                <li>✓ 5-minute polling</li>
              </ul>
            </div>
            <div className="rounded-lg border p-6 text-left border-primary">
              <h3 className="font-semibold text-lg">Pro</h3>
              <p className="text-3xl font-bold mt-2">$39</p>
              <p className="text-sm text-muted-foreground mb-4">per month</p>
              <ul className="space-y-2 text-sm">
                <li>✓ Up to 100 keywords</li>
                <li>✓ Email alerts</li>
                <li>✓ 5-minute polling</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} BuzzAlert. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
