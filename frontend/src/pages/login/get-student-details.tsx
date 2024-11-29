import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "~/components/ui/otp-field";
import { toast } from "solid-sonner";
import { createEffect, createSignal, For } from "solid-js";
import { TextField, TextFieldLabel, TextFieldRoot } from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";
import { useLocation } from "@solidjs/router";
import { createStore, unwrap } from "solid-js/store";
import { useNavigate } from "~/router";

export default function Login() {
  const { state } = useLocation<{ code: string }>();
  const navigate = useNavigate();

  const [store, setStore] = createStore({ name: "", studentId: "", code: state?.code! });
  createEffect(() => {
    setStore("studentId", store.studentId.replace(/\D/g, "").slice(0, 5));
    setStore("name", store.name.slice(0, 3));
  });

  function handle(e: SubmitEvent) {
    e.preventDefault();
    navigate("/login/waiting", { state: unwrap(store) })
  }

  return (
    <main class="w-screen h-screen grid grid-(cols-[repeat(2,1fr)] place-content-center) [&>*]:(p-4 m-auto)">
      <section class="bg-primary-foreground h-auto rd">
        <h1 class="font-normal text-xl">
          좌측에 인적사항을 입력해 주세요
        </h1>
      </section>

      <section class="grid place-content-center gap-2">
          <TextFieldRoot onChange={x => setStore("name", x)} value={store.name} required>
            <TextFieldLabel>이름</TextFieldLabel>
            <TextField placeholder="홍길동"></TextField>
          </TextFieldRoot>
          <TextFieldRoot onChange={x => setStore("studentId", x)} value={store.studentId} required>
            <TextFieldLabel>학번</TextFieldLabel>
            <TextField placeholder="00000" type="numeric"></TextField>
          </TextFieldRoot>
          <Button type="submit" onSubmit={handle}>제출하기</Button>
      </section>
    </main>
  );
}
