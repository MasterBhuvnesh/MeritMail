"use client";

import * as React from "react";
import data from "@/data/app.data";
import { NavAssets } from "@/components/nav-assets";
import { NavDatabase } from "@/components/nav-data";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavDatabase database={data.database} />
        <NavAssets items={data.Assets} />
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
