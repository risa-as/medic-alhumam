import { getStoreSetting } from "@/lib/settings";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const { storeName } = await getStoreSetting();
  return <LoginForm storeName={storeName} />;
}
