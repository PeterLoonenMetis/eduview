"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  title: string;
  href: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Map paths to readable titles
  const titleMap: Record<string, string> = {
    demo: "Home",
    visie: "Visie",
    leren: "Leren & Onderwijs",
    beroep: "Het Beroep",
    toetsing: "Toetsing",
    curriculum: "Curriculum",
    jaar: "Jaar",
    dashboard: "Dashboard",
    dekking: "Dekkingsmatrix",
    ec: "EC-Verdeling",
    toetsen: "Toetsoverzicht",
    planning: "Planning",
    beheer: "Beheer",
    gebruikers: "Gebruikers",
    leeruitkomsten: "Leeruitkomsten",
    instellingen: "Instellingen",
    blok: "Blok",
  };

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const title = titleMap[segment] || segment;
    breadcrumbs.push({ title, href: currentPath });
  }

  return breadcrumbs;
}

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-white px-6">
      {/* Breadcrumbs */}
      <div>
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((item, index) => (
            <span key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{item.title}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.title}
                </Link>
              )}
            </span>
          ))}
        </nav>
        {title && <h1 className="text-xl font-semibold mt-1">{title}</h1>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
