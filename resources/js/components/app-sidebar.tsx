import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import {
    Building2,
    MapPin,
    MapPinCheck,
    Users,
    CalendarCheck,
    CalendarCheck2,
    Clock,
    FileClock,
    DoorClosed,
    UserRoundPlus,
    UserRoundCheck,
    LayoutList,
    Settings,
  } from 'lucide-react';

// const mainNavItems: NavItem[] = [
//     {
//       title: 'Employee Dashboard',
//       href: '/employee/dashboard',
//       icon: LayoutList,
//     },
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Companies',
//         href: '/companies',
//         icon: Building2,
//       },
//       {
//         title: 'Departments',
//         href: '/departments',
//         icon: DoorClosed,
//       },
//       {
//         title: 'Locations',
//         href: '/locations',
//         icon: MapPin,
//       },
//       {
//         title: 'Locations Checker',
//         href: '/location-check',
//         icon: MapPinCheck,
//       },
//       {
//         title: 'Employees',
//         href: '/employees',
//         icon: Users,
//       },
//       {
//         title: 'Working Hours',
//         href: '/working-hours',
//         icon: Clock,
//       },
//       {
//         title: 'Work Schedule Types',
//         href: '/work-schedule-types',
//         icon: FileClock,
//       },
//       {
//         title: 'Attendances',
//         href: '/attendances',
//         icon: CalendarCheck,
//       },
//       {
//         title: 'Attendances Report',
//         href: '/attendance/report',
//         icon: CalendarCheck2,
//       },
//       {
//         title: 'Roles',
//         href: '/roles',
//         icon: UserRoundCheck,
//       },
//       {
//         title: 'Users',
//         href: '/users',
//         icon: UserRoundPlus,
//       },
// ];
  const mainNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/employee/dashboard',
      icon: LayoutList,
      permission: 'view self attendance',
    },
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
      permission: 'view dashboard super', // Optional if you have this
    },
    {
      title: 'Companies',
      href: '/companies',
      icon: Building2,
      permission: 'view companies',
    },
    {
      title: 'Departments',
      href: '/departments',
      icon: DoorClosed,
      permission: 'view departments',
    },
    {
      title: 'Locations',
      href: '/locations',
      icon: MapPin,
      permission: 'view locations',
    },
    {
      title: 'Locations Checker',
      href: '/location-check',
      icon: MapPinCheck,
      permission: 'view locations',
    },
    {
      title: 'Employees',
      href: '/employees',
      icon: Users,
      permission: 'view employees',
    },
    {
      title: 'Working Hours',
      href: '/working-hours',
      icon: Clock,
      permission: 'view working hours',
    },
    {
      title: 'Work Schedule Types',
      href: '/work-schedule-types',
      icon: FileClock,
      permission: 'view work schedule types',
    },
    {
      title: 'Attendances',
      href: '/attendances',
      icon: CalendarCheck,
      permission: 'view attendances',
    },
    {
      title: 'Attendances Report',
      href: '/attendance/report',
      icon: CalendarCheck2,
      permission: 'view attendance reports',
    },
    {
      title: 'Roles',
      href: '/roles',
      icon: UserRoundCheck,
      permission: 'view roles',
    },
    {
      title: 'Users',
      href: '/users',
      icon: UserRoundPlus,
      permission: 'view users',
    },
  ];


const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

// export function AppSidebar() {


export function AppSidebar() {
  const { props } = usePage<{
    auth?: {
      user: {
        permissions: string[];
      };
    };
  }>();

  const permissions = props.auth?.user?.permissions ?? [];


  const filteredNavItems: NavItem[] = mainNavItems.filter(
    item => !item.permission || permissions.includes(item.permission)
  );


    // return (
    //     <Sidebar collapsible="icon" variant="inset">
    //         <SidebarHeader>
    //             <SidebarMenu>
    //                 <SidebarMenuItem>
    //                     <SidebarMenuButton size="lg" asChild>
    //                         <Link href="/dashboard" prefetch>
    //                             <AppLogo />
    //                         </Link>
    //                     </SidebarMenuButton>
    //                 </SidebarMenuItem>
    //             </SidebarMenu>
    //         </SidebarHeader>

    //         <SidebarContent>
    //             <NavMain items={mainNavItems} />
    //         </SidebarContent>

    //         <SidebarFooter>
    //             <NavFooter items={footerNavItems} className="mt-auto" />
    //             <NavUser />
    //         </SidebarFooter>
    //     </Sidebar>
    // );
  return (
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" prefetch>
                  <AppLogo />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={filteredNavItems} />
        </SidebarContent>

        <SidebarFooter>
          <NavFooter items={footerNavItems} className="mt-auto" />
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    );
  
}
