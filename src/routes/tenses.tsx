import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tenses")({
  beforeLoad: () => {
    throw redirect({ to: "/tenses/$tense", params: { tense: "simple-present" } });
  },
  component: () => null,
});
