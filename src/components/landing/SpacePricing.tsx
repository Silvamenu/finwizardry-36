import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PricingCardProps {
  title: "Basic" | "Standard" | "Pro";
  monthlyPrice: string;
  yearlyPrice: string;
  description?: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

const pricingData: PricingCardProps[] = [
  {
    title: "Basic",
    monthlyPrice: "$29",
    yearlyPrice: "$290",
    description: "Perfect for small businesses and individuals.",
    features: ["3 Pages", "Basic SEO", "Email Support", "Responsive Design"],
    cta: "Choose Basic",
    href: "/login",
  },
  {
    title: "Standard",
    monthlyPrice: "$59",
    yearlyPrice: "$590",
    description: "Best for growing businesses with more needs.",
    features: ["10 Pages", "Advanced SEO", "CMS Integration", "24/7 Chat Support"],
    cta: "Choose Standard",
    href: "/login",
    featured: true,
  },
  {
    title: "Pro",
    monthlyPrice: "$99",
    yearlyPrice: "$990",
    description: "Ideal for larger businesses that need scalability.",
    features: ["Unlimited Pages", "E-commerce Integration", "Priority Support", "Custom API Integration"],
    cta: "Choose Pro",
    href: "/login",
  },
];

const SpacePricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-24 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pricing
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Select the plan that best suits your needs.
          </p>
        </motion.div>

        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Tabs
            value={billingPeriod}
            onValueChange={(v) => setBillingPeriod(v as "monthly" | "yearly")}
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="relative data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">
                Yearly
                <Badge className="absolute -top-3 -right-2 bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5">
                  Save 17%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {pricingData.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PricingCard plan={plan} billingPeriod={billingPeriod} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

function PricingCard({
  plan,
  billingPeriod,
}: {
  plan: PricingCardProps;
  billingPeriod: "monthly" | "yearly";
}) {
  const price =
    billingPeriod === "monthly" ? `${plan.monthlyPrice}/month` : `${plan.yearlyPrice}/year`;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-6 h-full",
        "bg-white/5 backdrop-blur-xl border border-white/10",
        "hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300",
        plan.featured && "border-white/30 bg-white/10 scale-105"
      )}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-white">{plan.title}</h3>
          {plan.featured && (
            <Badge className="bg-white/20 text-white border-white/30">
              Most popular
            </Badge>
          )}
        </div>
        <p className="text-3xl font-bold text-white mb-2">{price}</p>
        {plan.description && (
          <p className="text-sm text-white/50">{plan.description}</p>
        )}
      </div>

      <hr className="border-white/10 my-4" />

      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-white/80">
            <CircleCheck className="h-5 w-5 text-green-400 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Link to={plan.href}>
          <Button
            className={cn(
              "w-full",
              plan.featured
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
            )}
          >
            {plan.cta}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default SpacePricing;
