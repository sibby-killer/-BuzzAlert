"use client";

import { initializePaystack } from "@/app/actions/payments";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$15",
    period: "/month",
    description: "For indie hackers getting started",
    keywords: 25,
    features: [
      "Up to 25 keywords",
      "Email alerts",
      "5-minute polling",
      "Basic support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$39",
    period: "/month",
    description: "For serious founders and marketers",
    keywords: 100,
    popular: true,
    features: [
      "Up to 100 keywords",
      "Email alerts",
      "5-minute polling",
      "Priority support",
      "Advanced analytics",
    ],
  },
];

function PricingCardsInner({
  currentPlan,
  email,
}: {
  currentPlan: string;
  email: string;
}) {
  const searchParams = useSearchParams();

  if (searchParams.get("success") === "true") {
    toast.success("Payment successful! Your plan has been upgraded.");
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
      {plans.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        return (
          <Card
            key={plan.id}
            className={plan.popular ? "border-primary shadow-lg" : ""}
          >
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  {plan.popular && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Popular
                    </span>
                  )}
                </div>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <form
                action={async () => {
                  try {
                    const url = await initializePaystack(plan.id);
                    window.location.href = url;
                  } catch (e: any) {
                    toast.error(e.message);
                  }
                }}
                className="w-full"
              >
                <Button
                  type="submit"
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : `Choose ${plan.name}`}
                </Button>
              </form>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export function PricingCards(props: {
  currentPlan: string;
  email: string;
}) {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <PricingCardsInner {...props} />
    </Suspense>
  );
}
