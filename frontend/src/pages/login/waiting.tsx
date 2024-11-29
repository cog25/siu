import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "~/components/ui/otp-field";
import { toast } from "solid-sonner";
import { createEffect, createSignal, For } from "solid-js";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";
import { useLocation } from "@solidjs/router";
import type { AppRouter } from "@siu/backend/src/app";
import { int2ip } from "~/utils/ip";
import { omit } from "es-toolkit/object";
import { useNavigate } from "~/router";

export default function Login() {
  const { state } = useLocation<{
    name: string,
    studentId: string,
    code: string,
  }>();

  const navigate = useNavigate();
  function handle() {
    navigate("/test/:problem?", { params: {} });
  }


  return (
    <main class="w-screen h-screen grid grid-content-center gap-4 [&>*]:(p-4 m-auto)">
      <section class="bg-primary-foreground rd animate-bounce-alt animate-count-infinite animate-duration-3s">
        <h1 class="font-normal text-xl">
          시험이 시작하기 전까지 기다려 주세요.
        </h1>
      </section>
      <pre class="text-secondary-foreground/50 text-xs" onClick={handle}>{JSON.stringify(state ?? { error: "nothing" })}</pre>
    </main>
  );
}
