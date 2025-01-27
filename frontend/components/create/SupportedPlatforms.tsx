"use client";

import { Card } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Store, 
  Globe, 
  ShoppingBag, 
  AppWindow,
  Phone
} from "lucide-react";

const platforms = [
  { 
    name: "Amazon", 
    icon: ShoppingCart,
    description: "Product listings from Amazon marketplace",
    color: "from-orange-400/20 to-orange-600/20"
  },
  { 
    name: "Shopify", 
    icon: Store,
    description: "Your Shopify store products",
    color: "from-green-400/20 to-green-600/20"
  },
  { 
    name: "Any Website", 
    icon: Globe,
    description: "Products from any website",
    color: "from-blue-400/20 to-blue-600/20"
  },
  { 
    name: "Etsy", 
    icon: ShoppingBag,
    description: "Handmade and vintage items",
    color: "from-teal-400/20 to-teal-600/20"
  },
  { 
    name: "App Store", 
    icon: AppWindow,
    description: "iOS app promotional content",
    color: "from-indigo-400/20 to-indigo-600/20"
  },
  { 
    name: "Play Store", 
    icon: Phone,
    description: "Android app promotional content",
    color: "from-purple-400/20 to-purple-600/20"
  }
];

export function SupportedPlatforms() {
  return (
    <div className="mb-8">
      <p className="text-xl font-semibold text-white mb-4">Supported Platforms</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Card
            key={platform.name}
            className={`bg-gradient-to-br ${platform.color} border-purple-800/20 p-4 backdrop-blur-sm hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <platform.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">{platform.name}</h3>
                <p className="text-sm text-purple-200">{platform.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}