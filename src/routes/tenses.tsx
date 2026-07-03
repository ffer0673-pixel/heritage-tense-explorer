import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tenses")({
  beforeLoad: () => {
    throw redirect({ to: "/tenses/simple-present" });
  },
  component: () => null,
});
