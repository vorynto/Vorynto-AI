import { Suspense } from "react";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-lg"><div className="glass-card p-8 border border-white/10 animate-pulse h-96" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
