"use client"

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CurvedDashboardHero from "@/components/dashboard/CurvyDashboardHero";
import { FeaturedProducts } from "@/components/dashboard/FeaturedProducts";
import { PopularTools } from "@/components/dashboard/PopularTools";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <CurvedDashboardHero />
      <FeaturedProducts />
      <PopularTools />
    </DashboardLayout>
  );
}