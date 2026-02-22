"use client";

import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: CalendarDays,
  },
  {
    title: "Médicos",
    url: "/doctors",
    icon: Stethoscope,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: UsersRound,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const session = authClient.useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/authentication");
        },
      },
    });
  };
  return (
    <Sidebar>
      <SidebarHeader className="bg-primary border-b p-4">
        <Image
          src="images/medicare-logo-white.svg"
          alt="Logo Medicare"
          width={136}
          height={28}
        />
      </SidebarHeader>
      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-white transition-colors hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white"
                  >
                    <Link href={item.url}>
                      <item.icon className="text-white" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-primary">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="mb-4 flex items-center gap-2 text-white">
              <Avatar>
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <p className="text-sm">{session.data?.user?.clinic?.name}</p>
                <p className="text-sm">{session.data?.user.email}</p>
              </div>
            </div>

            <div className="border-t">
              <div className="mt-4 rounded-lg p-2 text-sm text-white transition-colors hover:bg-white/10 hover:text-white">
                <button onClick={handleSignOut}>Sair</button>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
