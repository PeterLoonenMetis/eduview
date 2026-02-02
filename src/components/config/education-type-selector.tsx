"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GraduationCap, School, Check } from "lucide-react";

interface EducationTypeSelectorProps {
  value?: "MBO" | "HBO";
  onChange: (type: "MBO" | "HBO") => void;
  disabled?: boolean;
}

const educationTypes = [
  {
    value: "MBO" as const,
    title: "MBO",
    description: "Middelbaar beroepsonderwijs",
    details: [
      "Niveau 1-4",
      "BOL of BBL leerweg",
      "Kwalificatiedossier & kerntaken",
      "Werkprocessen als basis",
    ],
    icon: School,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    hoverColor: "hover:border-blue-300",
  },
  {
    value: "HBO" as const,
    title: "HBO",
    description: "Hoger beroepsonderwijs",
    details: [
      "Bachelor, Master of AD",
      "Voltijd, deeltijd of duaal",
      "Leeruitkomsten & toetsing",
      "ECTS studiepunten",
    ],
    icon: GraduationCap,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-500",
    hoverColor: "hover:border-teal-300",
  },
];

export function EducationTypeSelector({
  value,
  onChange,
  disabled,
}: EducationTypeSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {educationTypes.map((type) => {
        const isSelected = value === type.value;
        const Icon = type.icon;

        return (
          <Card
            key={type.value}
            className={cn(
              "cursor-pointer transition-all duration-200",
              isSelected
                ? `border-2 ${type.borderColor} ${type.bgColor}`
                : `border hover:shadow-md ${type.hoverColor}`,
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && onChange(type.value)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "rounded-xl p-3",
                      isSelected ? type.bgColor : "bg-muted",
                      isSelected ? type.color : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </div>
                </div>
                {isSelected && (
                  <div className={cn("rounded-full p-1", type.bgColor, type.color)}>
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {type.details.map((detail, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isSelected ? type.color.replace("text-", "bg-") : "bg-muted-foreground"
                      )}
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
