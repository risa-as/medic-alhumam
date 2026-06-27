import { NextResponse } from "next/server";
import { ZodError } from "zod";

/** خطأ API بحالة HTTP ورمز ورسالة. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

/** يحوّل أي خطأ إلى استجابة JSON موحّدة. */
export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.status },
    );
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: "بيانات غير صالحة", details: error.flatten() } },
      { status: 422 },
    );
  }
  console.error(error);
  return NextResponse.json(
    { error: { code: "INTERNAL", message: "حدث خطأ داخلي" } },
    { status: 500 },
  );
}

/** يقرأ جسم الطلب ويتحقق منه عبر Zod (يعيد نوع المخرجات بعد تطبيق القيم الافتراضية). */
export async function parseBody<T>(
  req: Request,
  schema: { parse: (data: unknown) => T },
): Promise<T> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw new ApiError(400, "BAD_JSON", "جسم الطلب غير صالح");
  }
  return schema.parse(json);
}

/** غلاف يلتقط الأخطاء ويعيد استجابة موحّدة. */
export async function handleRoute(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error) {
    return errorResponse(error);
  }
}
