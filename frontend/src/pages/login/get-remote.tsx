import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSlot,
} from "~/components/ui/otp-field";
import { createEffect, createSignal, For } from "solid-js";
import { useNavigate } from "~/router";
import { Button } from "~/components/ui/button";

export default function Login() {
  const N = 7;
  const [code, setCode] = createSignal<string>("");

  createEffect(()=>{
    const computed = code().toLowerCase()
    if(code() !== computed) setCode(computed)
  });

  createEffect(()=>{
    if(code().length == N) {
      useNavigate()("/login/get-student-details", { state: { code: code() } })
    }
  });

  // function handle() {
  //   if(code().length == N) {
  //     useNavigate()("/login/get-student-details", { state: { code: code() } })
  //   }
  // }

  return (
    <main class="w-screen h-screen grid grid-(cols-[repeat(2,1fr)] place-content-center) p-2 [&>*]:(p-6 m-auto)">
      <section class="bg-primary-foreground outline-(accent 4) shadow-sm rd">
      <h1 class="font-normal text-xl">
          TV, 혹은 프로젝터의 표시된 {N}자리 코드를 입력해 주세요
        </h1>
      </section>
      <section class="grid place-content-center">
        <OTPField maxLength={N} value={code()} onValueChange={setCode} class="shadow">
          <OTPFieldInput pattern="^[a-zA-Z0-9]*$"/>
          <OTPFieldGroup>
            <For each={[...Array(N).keys()]}>
              {(i) => <OTPFieldSlot index={i} />}
            </For>
          </OTPFieldGroup>
          {/* <Button onClick={handle} disabled={N!=code().length}>→</Button> */}
        </OTPField>
      </section>
    </main>
  );
}
