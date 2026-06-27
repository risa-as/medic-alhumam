"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count <= 0) {
      router.replace("/products");
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, router]);

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <PartyPopper className="h-16 w-16" style={{ color: "var(--color-primary)" }} strokeWidth={1.5} />
      <h1 className="text-3xl font-bold text-gray-900">شكرًا لطلبك!</h1>
      <p className="max-w-md text-gray-500">
        تم استلام طلبك بنجاح. سيتواصل معك فريقنا قريبًا لتأكيد التوصيل.
      </p>

      {/* عدّاد تنازلي (FR-034) */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
          {count}
        </div>
        <p className="text-sm text-gray-400">سيتم تحويلك للمتجر خلال {count} ثوانٍ...</p>
      </div>

      <button onClick={() => router.replace("/products")}
        className="rounded-[var(--radius)] bg-primary px-8 py-3 text-white font-semibold hover:bg-primary-hover">
        انتقل للمتجر الآن
      </button>
    </div>
  );
}
