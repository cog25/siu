import { A, Navigate } from "~/router";
import { Button } from "~/components/ui/button"
import { Component, ValidComponent } from "solid-js";

const LinkToTest: ValidComponent = (props) => (
  <A href="/test" {...props}/>
)

export default function Home() {
  return <>
    <Navigate href="/login/get-remote"></Navigate>
  </>
}