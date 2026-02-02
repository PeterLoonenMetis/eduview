import prisma from "@/lib/prisma";

export type InstituteWithRelations = Awaited<ReturnType<typeof getInstituteById>>;

export async function getInstitutes() {
  return prisma.institute.findMany({
    include: {
      academies: {
        include: {
          _count: {
            select: { programs: true },
          },
        },
      },
      _count: {
        select: { academies: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getInstituteById(id: string) {
  return prisma.institute.findUnique({
    where: { id },
    include: {
      academies: {
        include: {
          programs: {
            include: {
              _count: {
                select: { cohorts: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function getFirstInstitute() {
  return prisma.institute.findFirst({
    include: {
      academies: {
        include: {
          programs: {
            include: {
              cohorts: {
                where: { isActive: true },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
}

export type CreateInstituteInput = {
  name: string;
  code: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export async function createInstitute(data: CreateInstituteInput) {
  return prisma.institute.create({
    data: {
      name: data.name,
      code: data.code,
      logoUrl: data.logoUrl,
      primaryColor: data.primaryColor || "#164B44",
      secondaryColor: data.secondaryColor || "#E8AE27",
    },
  });
}

export type UpdateInstituteInput = Partial<CreateInstituteInput>;

export async function updateInstitute(id: string, data: UpdateInstituteInput) {
  return prisma.institute.update({
    where: { id },
    data,
  });
}

export async function deleteInstitute(id: string) {
  return prisma.institute.delete({
    where: { id },
  });
}

// Academies
export async function getAcademies(instituteId?: string) {
  return prisma.academy.findMany({
    where: instituteId ? { instituteId } : undefined,
    include: {
      institute: true,
      _count: {
        select: { programs: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export type CreateAcademyInput = {
  instituteId: string;
  name: string;
  code: string;
  description?: string;
};

export async function createAcademy(data: CreateAcademyInput) {
  return prisma.academy.create({
    data: {
      instituteId: data.instituteId,
      name: data.name,
      code: data.code,
      description: data.description,
    },
  });
}

export async function updateAcademy(
  id: string,
  data: Partial<Omit<CreateAcademyInput, "instituteId">>
) {
  return prisma.academy.update({
    where: { id },
    data,
  });
}

export async function deleteAcademy(id: string) {
  return prisma.academy.delete({
    where: { id },
  });
}
