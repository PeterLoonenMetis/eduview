import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VisionEditor } from "@/components/admin/vision/vision-editor";
import { PrincipleList } from "@/components/admin/vision/principle-list";
import { getVisionById } from "@/lib/db/visions";
import { ArrowLeft, BookOpen, Briefcase, ClipboardCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ visionId: string }>;
}

const visionConfig = {
  LEARNING: {
    icon: BookOpen,
    label: "Visie op Leren en Onderwijs",
    color: "bg-teal-100 text-teal-700",
    description: "Beschrijf hoe studenten leren en hoe het onderwijs is ingericht.",
  },
  PROFESSION: {
    icon: Briefcase,
    label: "Visie op het Beroep",
    color: "bg-amber-100 text-amber-700",
    description: "Beschrijf het beroepenveld en de rol van de professional.",
  },
  ASSESSMENT: {
    icon: ClipboardCheck,
    label: "Visie op Toetsing en Examinering",
    color: "bg-blue-100 text-blue-700",
    description: "Beschrijf hoe getoetst wordt en wat de toetsprincipes zijn.",
  },
};

export default async function EditVisionPage({ params }: PageProps) {
  const { visionId } = await params;
  const vision = await getVisionById(visionId);

  if (!vision) {
    notFound();
  }

  const config = visionConfig[vision.type];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/demo/beheer/visies?cohortId=${vision.cohortId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${config.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{config.label}</h1>
            <p className="text-muted-foreground">
              {vision.cohort.program.name} - {vision.cohort.name}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Linker kolom: Visie editor */}
        <div className="rounded-lg border bg-card p-6">
          <VisionEditor vision={vision} />
        </div>

        {/* Rechter kolom: Uitgangspunten */}
        <div className="rounded-lg border bg-card p-6">
          <PrincipleList visionId={vision.id} principles={vision.principles} />
        </div>
      </div>

      {/* Gekoppelde leeruitkomsten */}
      {vision.outcomeLinks.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Gekoppelde leeruitkomsten</h3>
          <div className="space-y-2">
            {vision.outcomeLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div>
                  <span className="font-medium">{link.outcome.code}</span>
                  <span className="text-muted-foreground ml-2">{link.outcome.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">{link.relevance}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
