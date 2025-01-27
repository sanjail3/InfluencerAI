import React, { useState, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star, Sparkles, Zap, Lock } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { formatPrice } from "@/lib/lemon-squeezy/utils";
import { CheckoutButton } from "../lemon-squeezy/CheckoutButton";

// Component interface definitions remain the same...
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
  id: string;
  isUsageBased: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export function Pricing({
  plans,
  title = "✨ Choose Your Perfect Plan ✨",
  description = "Unlock amazing features that help you grow! 🚀\nAll plans include our award-winning support and powerful tools.",
}: {
  plans: any;
  title?: string;
  description?: string;
  
}) {
  const [isMonthly, setIsMonthly] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: rect.left / window.innerWidth + rect.width / (2 * window.innerWidth),
          y: rect.top / window.innerHeight + rect.height / (2 * window.innerHeight),
        },
        colors: ['#FF3E9D', '#7E52FF', '#E4FF3E', '#3EFFED'],
        startVelocity: 45,
      });
    }
  };

  return (
    <div className="container py-20 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      
      <motion.div 
        className="text-center space-y-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          {title}
        </h2>
        <p className="text-gray-300 text-lg whitespace-pre-line">
          {description}
        </p>
      </motion.div>

      <div className="flex justify-center mb-10 items-center space-x-4">
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <Label>
            <Switch
              ref={switchRef as any}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
          </Label>
          <span className="ml-2 font-semibold text-gray-200">
            Annual billing <span className="text-purple-400">🎉 Save 20%</span>
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {plans.map((plan:any, index:any) => (
          console.log(plan),
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
            }}
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
            className={cn(
              "rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden",
              plan.isPopular ? "border-2 border-purple-500" : "border border-gray-800",
              "bg-gradient-to-b from-gray-900/90 to-gray-950/90"
            )}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-50" />
            
            {plan.isPopular && (
              <motion.div
                className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 py-1 px-3 rounded-bl-xl rounded-tr-xl flex items-center"
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Sparkles className="text-white h-4 w-4" />
                <span className="text-white ml-1 font-semibold">Most Popular</span>
              </motion.div>
            )}

            <div className="relative z-10">
              <p className="text-xl font-semibold text-gray-200 mb-2">
                {plan.name} {index === 1 ? "⭐" : index === 2 ? "💎" : "🌟"}
              </p>
              
              <motion.div 
                className="mt-4"
                animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-5xl font-bold text-white">
                  <NumberFlow
                    // value={isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)}
                    value={isMonthly ? Number(formatPrice(plan.price)) : Number(formatPrice(plan.yearlyPrice))}
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    }}
                    transformTiming={{ duration: 500 }}
                    className="font-variant-numeric: tabular-nums"
                  />
                </span>
                <span className="text-gray-400 ml-2">
                  /{plan.period}
                </span>
              </motion.div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature:any, idx:any) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="h-5 w-5 text-purple-400 mt-1" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.div 
                className="mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckoutButton
                  plan={plan}
                  isChangingPlans={false}
                  embed={false}
                  buttonname={plan.buttonText}
                  isPopular={plan.isPopular}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full py-6 text-lg font-semibold",
                    plan.isPopular 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                      : "bg-gray-800/50 text-gray-200 border-gray-700 hover:bg-gray-700/50"
                  )}
                >
                  {plan.buttonText} {plan.isPopular ? "⚡" : "→"}
                </CheckoutButton>
              </motion.div>

              <p className="mt-4 text-sm text-gray-400">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}