import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "./auth";

const f = createUploadthing();

/** يتطلب مستخدمًا بدور ADMIN لرفع وسائط المنتجات. */
async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    throw new UploadThingError("غير مصرّح برفع الوسائط");
  }
  return { userId: (session!.user as { id?: string }).id ?? "" };
}

export const ourFileRouter = {
  // صور المنتجات (حتى 5 صور)
  productImage: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(() => requireAdmin())
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  // فيديو المنتج (واحد)
  productVideo: f({ video: { maxFileSize: "64MB", maxFileCount: 1 } })
    .middleware(() => requireAdmin())
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

  // شعار المتجر (صورة واحدة)
  storeLogo: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => requireAdmin())
    .onUploadComplete(({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
