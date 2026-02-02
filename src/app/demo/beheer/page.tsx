import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  Eye,
  Target,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import { getPrograms } from "@/lib/db/programs";
import { getFirstInstitute } from "@/lib/db/institutes";

export default async function BeheerPage() {
  const programs = await getPrograms();
  const institute = await getFirstInstitute();

  const stats = {
    programs: programs.length,
    cohorts: programs.reduce((sum, p) => sum + p._count.cohorts, 0),
  };

  const menuItems = [
    {
      title: "Opleidingen",
      description: "Beheer opleidingen en hun basisgegevens",
      href: "/demo/beheer/opleidingen",
      icon: GraduationCap,
      count: stats.programs,
      color: "bg-primary-100 text-primary-600",
    },
    {
      title: "Cohorten",
      description: "Beheer cohorten per opleiding",
      href: "/demo/beheer/cohorten",
      icon: Users,
      count: stats.cohorts,
      color: "bg-secondary-100 text-secondary-600",
    },
    {
      title: "Visies",
      description: "Bewerk de drie visie-ankerpunten",
      href: "/demo/beheer/visies",
      icon: Eye,
      color: "bg-accent-100 text-accent-600",
    },
    {
      title: "Leeruitkomsten",
      description: "Beheer leeruitkomsten en koppelingen",
      href: "/demo/beheer/leeruitkomsten",
      icon: Target,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Curriculum",
      description: "Bewerk jaren, blokken en onderwijseenheden",
      href: "/demo/beheer/curriculum",
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Beheer</h1>
        <p className="text-muted-foreground mt-1">
          Beheer alle onderdelen van het curriculum
        </p>
      </div>

      {/* Institute Info */}
      {institute && (
        <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Instelling</p>
                <h2 className="text-xl font-bold mt-1">{institute.name}</h2>
                <p className="text-primary-100 text-sm mt-1">
                  {stats.programs} opleiding{stats.programs !== 1 ? "en" : ""} •{" "}
                  {stats.cohorts} cohort{stats.cohorts !== 1 ? "en" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full hover:shadow-md hover:border-primary-300 transition-all group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  {item.count !== undefined && (
                    <span className="text-2xl font-bold text-muted-foreground">
                      {item.count}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mt-4 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary-500">
                  Beheren
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
