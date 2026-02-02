"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import type { EducationType } from "@prisma/client";
import { getTerminology, type TerminologyMap, type TerminologyKey, formatCredits } from "@/lib/education-types/terminology";

type EducationContextType = {
  educationType: EducationType;
  terminology: TerminologyMap;
  getTerm: (key: TerminologyKey) => string;
  formatCredits: (amount: number) => string;
  isMBO: boolean;
  isHBO: boolean;
};

const EducationContext = createContext<EducationContextType | null>(null);

interface EducationProviderProps {
  children: ReactNode;
  educationType: EducationType;
}

export function EducationProvider({ children, educationType }: EducationProviderProps) {
  const value = useMemo(() => {
    const terminology = getTerminology(educationType);

    return {
      educationType,
      terminology,
      getTerm: (key: TerminologyKey) => terminology[key],
      formatCredits: (amount: number) => formatCredits(educationType, amount),
      isMBO: educationType === "MBO",
      isHBO: educationType === "HBO",
    };
  }, [educationType]);

  return (
    <EducationContext.Provider value={value}>
      {children}
    </EducationContext.Provider>
  );
}

export function useEducation() {
  const context = useContext(EducationContext);
  if (!context) {
    throw new Error("useEducation must be used within an EducationProvider");
  }
  return context;
}

export function useTerminology() {
  return useEducation().terminology;
}

export function useTerm(key: TerminologyKey) {
  return useEducation().getTerm(key);
}

// Hook that returns null instead of throwing if not in provider
export function useEducationOptional() {
  return useContext(EducationContext);
}
