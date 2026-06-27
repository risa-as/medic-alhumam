import { cookies } from "next/headers";
import { CheckoutClient } from "./CheckoutClient";
import { customerSessionSchema } from "@medic/core";

/** يقرأ كوكي الجلسة على الخادم ويمرّره للعميل (T060). */
export default async function CheckoutPage() {
  const store = await cookies();
  const raw = store.get("medic_customer")?.value;
  let session = null;
  if (raw) {
    try {
      session = customerSessionSchema.parse(JSON.parse(raw));
    } catch {}
  }
  return <CheckoutClient initialSession={session} />;
}
