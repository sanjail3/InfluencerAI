"use client";

import { syncPlans } from '@/lib/lemon-squeezy/actions';
import { useState, useEffect } from "react";
import { Pricing } from "@/components/ui/pricing";
import { SubscriptionPlan, } from "@prisma/client";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  variantId: number;
}

async function fetchSubscriptionPlans() {
  try {
    const response = await fetch('/api/subscription-plans'); // You'll need to create this API route
    const plans = await response.json();
    return plans;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
}

// Helper function to transform database plans to UI format
function transformPlansToUIFormat(dbPlans: SubscriptionPlan[]): PricingPlan[] {
  
  
    const planFeatureMap = {
    starter: [
      "Up to 10 projects",
      "Basic analytics",
      "48-hour support response time",
      "Limited API access",
      "Community support",
    ],
    professional: [
      "Unlimited projects",
      "Advanced analytics",
      "24-hour support response time",
      "Full API access",
      "Priority support",
      "Team collaboration",
      "Custom integrations",
    ],
    enterprise: [
      "Everything in Professional",
      "Custom solutions",
      "Dedicated account manager",
      "1-hour support response time",
      "SSO Authentication",
      "Advanced security",
      "Custom contracts",
      "SLA agreement",
    ],
  };

  return dbPlans.map((plan) => {
    const planKey = plan.name.toLowerCase() as keyof typeof planFeatureMap;
    const basePrice = parseFloat(plan.price);
    
    return {
      name: plan.productName.toUpperCase(),
      price: basePrice.toString(),
      yearlyPrice: (basePrice * 0.8).toString(), // 20% discount for yearly
      period: "per month",
      features: planFeatureMap[planKey] || [],
      description: plan.name === "professional" 
        ? "Ideal for growing teams and businesses"
        : plan.name === "enterprise"
          ? "For large organizations with specific needs"
          : "Perfect for individuals and small projects",
      buttonText: plan.name === "enterprise" 
        ? "Contact Sales" 
        : "Get Started",
      href: plan.name === "Enterprise" ? "/contact" : "/sign-up",
      isPopular: plan.name === "professional",
      variantId: plan.variantId,
    };
  });
}

function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const dbPlans = await fetchSubscriptionPlans();
        const transformedPlans = transformPlansToUIFormat(dbPlans);
        setPlans(transformedPlans);
      } catch (err) {
        setError("Failed to load subscription plans");
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  if (loading) {
    return <div className="h-[800px] flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-[800px] flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="h-[800px] overflow-y-auto rounded-lg create-page-background">
      <Pricing
        plans={plans}
        title="Simple, Transparent Pricing"
        description="Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support."
      />
    </div>
  );
}

export default PricingPage;