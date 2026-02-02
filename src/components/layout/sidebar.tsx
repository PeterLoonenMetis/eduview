"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  LayoutDashboard,
  Calendar,
  Settings,
  ChevronDown,
  GraduationCap,
  Eye,
  Users,
  Home,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgramContext } from "@/lib/contexts/program-context";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: { title: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    title: "Home",
    href: "/demo",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Visie",
    href: "/demo/visie",
    icon: <Eye className="h-5 w-5" />,
    children: [
      { title: "Leren & Onderwijs", href: "/demo/visie/leren" },
      { title: "Het Beroep", href: "/demo/visie/beroep" },
      { title: "Toetsing", href: "/demo/visie/toetsing" },
    ],
  },
  {
    title: "Curriculum",
    href: "/demo/curriculum",
    icon: <BookOpen className="h-5 w-5" />,
    children: [
      { title: "Overzicht", href: "/demo/curriculum" },
      { title: "Jaar 1", href: "/demo/curriculum/jaar/1" },
      { title: "Jaar 2", href: "/demo/curriculum/jaar/2" },
      { title: "Jaar 3", href: "/demo/curriculum/jaar/3" },
      { title: "Jaar 4", href: "/demo/curriculum/jaar/4" },
    ],
  },
  {
    title: "Dashboard",
    href: "/demo/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    children: [
      { title: "Dekkingsmatrix", href: "/demo/dashboard/dekking" },
      { title: "EC-Verdeling", href: "/demo/dashboard/ec" },
      { title: "Toetsoverzicht", href: "/demo/dashboard/toetsen" },
    ],
  },
  {
    title: "Planning",
    href: "/demo/planning",
    icon: <Calendar className="h-5 w-5" />,
  },
];

const adminNavigation: NavItem[] = [
  {
    title: "Beheer",
    href: "/demo/beheer",
    icon: <Settings className="h-5 w-5" />,
    children: [
      { title: "Opleidingen", href: "/demo/beheer/opleidingen" },
      { title: "Gebruikers", href: "/demo/beheer/gebruikers" },
      { title: "Leeruitkomsten", href: "/demo/beheer/leeruitkomsten" },
      { title: "Instellingen", href: "/demo/beheer/instellingen" },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r border-border bg-white",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/demo" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-bold text-primary-500">
            CurriculumView
          </span>
        </Link>
      </div>

      {/* Program Selector */}
      <ProgramSelector />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <NavItemComponent key={item.href} item={item} pathname={pathname} />
          ))}
        </ul>

        {/* Admin Section */}
        <div className="mt-8 border-t border-border pt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
            Beheer
          </p>
          <ul className="space-y-1">
            {adminNavigation.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                pathname={pathname}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Demo Gebruiker</p>
            <p className="text-xs text-muted-foreground">Onderwijsontwikkelaar</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ProgramSelector() {
  const {
    programs,
    cohorts,
    selectedProgram,
    selectedCohort,
    setSelectedProgram,
    setSelectedCohort,
    isLoading,
  } = useProgramContext();

  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showCohortDropdown, setShowCohortDropdown] = useState(false);
  const programRef = useRef<HTMLDivElement>(null);
  const cohortRef = useRef<HTMLDivElement>(null);

  // Filter cohorts for selected program
  const programCohorts = selectedProgram
    ? cohorts.filter((c) => c.programId === selectedProgram.id)
    : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (programRef.current && !programRef.current.contains(event.target as Node)) {
        setShowProgramDropdown(false);
      }
      if (cohortRef.current && !cohortRef.current.contains(event.target as Node)) {
        setShowCohortDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="border-b border-border p-4">
        <Link
          href="/demo/beheer/opleidingen/nieuw"
          className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 text-sm text-muted-foreground hover:border-primary-300 hover:text-primary-600"
        >
          + Maak eerste opleiding aan
        </Link>
      </div>
    );
  }

  return (
    <div className="border-b border-border p-4 space-y-2">
      {/* Program Dropdown */}
      <div ref={programRef} className="relative">
        <button
          onClick={() => {
            setShowProgramDropdown(!showProgramDropdown);
            setShowCohortDropdown(false);
          }}
          className="flex w-full items-center justify-between rounded-lg bg-muted p-3 text-left hover:bg-gray-100"
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Opleiding</p>
            <p className="font-medium truncate">
              {selectedProgram?.name || "Selecteer opleiding"}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ml-2",
              showProgramDropdown && "rotate-180"
            )}
          />
        </button>

        {showProgramDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border bg-white shadow-lg">
            <div className="max-h-64 overflow-y-auto py-1">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => {
                    setSelectedProgram(program);
                    setShowProgramDropdown(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100",
                    selectedProgram?.id === program.id && "bg-primary-50"
                  )}
                >
                  <div>
                    <p className="font-medium">{program.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {program.educationType} • {program.code}
                    </p>
                  </div>
                  {selectedProgram?.id === program.id && (
                    <Check className="h-4 w-4 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
            <div className="border-t p-1">
              <Link
                href="/demo/beheer/opleidingen/nieuw"
                className="flex w-full items-center px-3 py-2 text-sm text-primary-600 hover:bg-gray-100 rounded"
                onClick={() => setShowProgramDropdown(false)}
              >
                + Nieuwe opleiding
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Cohort Dropdown */}
      <div ref={cohortRef} className="relative">
        <button
          onClick={() => {
            if (selectedProgram && programCohorts.length > 0) {
              setShowCohortDropdown(!showCohortDropdown);
              setShowProgramDropdown(false);
            }
          }}
          className={cn(
            "flex w-full items-center justify-between rounded-lg bg-muted p-3 text-left",
            selectedProgram && programCohorts.length > 0
              ? "hover:bg-gray-100"
              : "opacity-50 cursor-not-allowed"
          )}
          disabled={!selectedProgram || programCohorts.length === 0}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Cohort</p>
            <p className="font-medium truncate">
              {selectedCohort
                ? selectedCohort.name
                : programCohorts.length === 0
                ? "Geen cohorten"
                : "Selecteer cohort"}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ml-2",
              showCohortDropdown && "rotate-180"
            )}
          />
        </button>

        {showCohortDropdown && programCohorts.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border bg-white shadow-lg">
            <div className="max-h-64 overflow-y-auto py-1">
              {programCohorts.map((cohort) => (
                <button
                  key={cohort.id}
                  onClick={() => {
                    setSelectedCohort(cohort);
                    setShowCohortDropdown(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100",
                    selectedCohort?.id === cohort.id && "bg-primary-50"
                  )}
                >
                  <div>
                    <p className="font-medium">{cohort.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cohort.startYear} - {cohort.endYear}
                    </p>
                  </div>
                  {selectedCohort?.id === cohort.id && (
                    <Check className="h-4 w-4 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavItemComponent({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary-50 text-primary-600"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        {item.icon}
        {item.title}
      </Link>
      {hasChildren && isActive && (
        <ul className="ml-8 mt-1 space-y-1">
          {item.children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                  pathname === child.href
                    ? "text-primary-600 font-medium"
                    : "text-gray-600 hover:text-primary-600"
                )}
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
