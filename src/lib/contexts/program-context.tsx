"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Program {
  id: string;
  name: string;
  code: string;
  educationType: "MBO" | "HBO";
}

interface Cohort {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  programId: string;
}

interface ProgramContextType {
  programs: Program[];
  cohorts: Cohort[];
  selectedProgram: Program | null;
  selectedCohort: Cohort | null;
  setSelectedProgram: (program: Program | null) => void;
  setSelectedCohort: (cohort: Cohort | null) => void;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedProgram, setSelectedProgramState] = useState<Program | null>(null);
  const [selectedCohort, setSelectedCohortState] = useState<Cohort | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/programs");
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs);
        setCohorts(data.cohorts);

        // Set default selections from localStorage or first available
        const savedProgramId = localStorage.getItem("selectedProgramId");
        const savedCohortId = localStorage.getItem("selectedCohortId");

        if (savedProgramId) {
          const program = data.programs.find((p: Program) => p.id === savedProgramId);
          if (program) {
            setSelectedProgramState(program);
            // Filter cohorts for this program
            const programCohorts = data.cohorts.filter((c: Cohort) => c.programId === program.id);
            if (savedCohortId) {
              const cohort = programCohorts.find((c: Cohort) => c.id === savedCohortId);
              if (cohort) setSelectedCohortState(cohort);
              else if (programCohorts.length > 0) setSelectedCohortState(programCohorts[0]);
            } else if (programCohorts.length > 0) {
              setSelectedCohortState(programCohorts[0]);
            }
          }
        } else if (data.programs.length > 0) {
          // Select first program by default
          const firstProgram = data.programs[0];
          setSelectedProgramState(firstProgram);
          localStorage.setItem("selectedProgramId", firstProgram.id);

          // Select first cohort of this program
          const programCohorts = data.cohorts.filter((c: Cohort) => c.programId === firstProgram.id);
          if (programCohorts.length > 0) {
            setSelectedCohortState(programCohorts[0]);
            localStorage.setItem("selectedCohortId", programCohorts[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setSelectedProgram = (program: Program | null) => {
    setSelectedProgramState(program);
    if (program) {
      localStorage.setItem("selectedProgramId", program.id);
      // When program changes, reset cohort to first of new program
      const programCohorts = cohorts.filter((c) => c.programId === program.id);
      if (programCohorts.length > 0) {
        setSelectedCohortState(programCohorts[0]);
        localStorage.setItem("selectedCohortId", programCohorts[0].id);
      } else {
        setSelectedCohortState(null);
        localStorage.removeItem("selectedCohortId");
      }
    } else {
      localStorage.removeItem("selectedProgramId");
      localStorage.removeItem("selectedCohortId");
      setSelectedCohortState(null);
    }
  };

  const setSelectedCohort = (cohort: Cohort | null) => {
    setSelectedCohortState(cohort);
    if (cohort) {
      localStorage.setItem("selectedCohortId", cohort.id);
    } else {
      localStorage.removeItem("selectedCohortId");
    }
  };

  return (
    <ProgramContext.Provider
      value={{
        programs,
        cohorts,
        selectedProgram,
        selectedCohort,
        setSelectedProgram,
        setSelectedCohort,
        isLoading,
        refreshData: fetchData,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgramContext() {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error("useProgramContext must be used within a ProgramProvider");
  }
  return context;
}
