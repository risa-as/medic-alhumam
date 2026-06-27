import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma, prisma } from "@medic/database";
import { categoryCreateSchema } from "@medic/core";
import { handleRoute, parseBody, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

export function GET() {
  return handleRoute(async () => {
    await requireRole("ADMIN", "CASHIER");
    const categories = await prisma.category.findMany({
      orderBy: { nameAr: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ data: categories });
  });
}

export function POST(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");
    const input = await parseBody(req, categoryCreateSchema);
    try {
      const category = await prisma.category.create({ data: input });
      revalidateTag("categories");
      return NextResponse.json(category, { status: 201 });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ApiError(409, "DUPLICATE_CATEGORY", "اسم الفئة موجود مسبقًا");
      }
      throw e;
    }
  });
}
