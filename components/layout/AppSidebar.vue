<script setup lang="ts">
import type { NavGroup, NavLink, NavSectionTitle } from "~/types/nav";
import { navMenu, navMenuBottom } from "~/constants/menus";

function resolveNavItemComponent(
  item: NavLink | NavGroup | NavSectionTitle,
): any {
  if ("children" in item) return resolveComponent("LayoutSidebarNavGroup");

  return resolveComponent("LayoutSidebarNavLink");
}

const teams: {
  name: string;
  logo: string;
  plan: string;
}[] = [
  {
    name: "Az Services",
    logo: "i-lucide-gallery-vertical-end",
    plan: "Enterprise",
  },
  {
    name: "Az Constuction.",
    logo: "i-lucide-audio-waveform",
    plan: "Startup",
  },
  {
    name: "Az Supplies.",
    logo: "i-lucide-command",
    plan: "Free",
  },
];

const user: {
  name: string;
  email: string;
  avatar: string;
} = {
  name: "Dian Pratama",
  email: "dianpratama2@gmail.com",
  avatar: "/avatars/avatartion.png",
};

const { sidebar } = useAppSettings();
</script>

<template>
  <Sidebar
    :collapsible="sidebar.collapsible"
    :side="sidebar.side"
    :variant="sidebar.variant"
  >
    <SidebarHeader>
      <LayoutSidebarNavHeader :teams="teams" />
      <Search />
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="(nav, indexGroup) in navMenu" :key="indexGroup">
        <SidebarGroupLabel v-if="nav.heading">
          {{ nav.heading }}
        </SidebarGroupLabel>
        <component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in nav.items"
          :key="index"
          :item="item"
        />
      </SidebarGroup>

      <SidebarGroup class="mt-auto">
        <component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in navMenuBottom"
          :key="index"
          :item="item"
          size="sm"
        />

        <!-- رابط عن التطبيق -->
        $1

        <!-- رابط الدعم الفني -->
        <NuxtLink
          to="/support"
          class="flex items-center gap-2 rounded px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          <Icon name="lucide:life-buoy" class="h-4 w-4 text-green-600" />
          <span>الدعم الفني</span>
        </NuxtLink>

        <!-- رابط الأسئلة الشائعة -->
        <NuxtLink
          to="/faq"
          class="flex items-center gap-2 rounded px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          <Icon name="lucide:help-circle" class="h-4 w-4 text-yellow-500" />
          <span>الأسئلة الشائعة</span>
        </NuxtLink>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <LayoutSidebarNavFooter :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
