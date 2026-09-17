"use client";

import { ProjectId } from "@/lib/content";
import { useDemoState } from "@/lib/project-focus";
import { LiveDemo } from "./LiveDemo";

/**
 * Thin subscriber between the focus store and a demo.
 *
 * It exists so that a focus change re-renders only the demo subtree — if the
 * act itself read the store, every focus flip would re-render the act's layout
 * and fight the GSAP tweens writing inline styles on those same nodes.
 */
export function DemoStage({ projectId, demo }: { projectId: string; demo: ProjectId }) {
  const state = useDemoState(projectId);
  return <LiveDemo demo={demo} state={state} />;
}
