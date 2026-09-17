"use client";

import { ProjectId } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { useLens } from "@/components/providers/LensProvider";
import type { DemoState } from "@/lib/project-focus";
import { AuraLiveDemo } from "./AuraLiveDemo";
import { NexusLiveDemo } from "./NexusLiveDemo";
import { MaestroLiveDemo } from "./MaestroLiveDemo";

/** Dispatches the right live demo for a project. */
export function LiveDemo({ demo, state }: { demo: ProjectId; state: DemoState }) {
  const { c } = useLang();
  const { lens } = useLens();
  if (demo === "aura") return <AuraLiveDemo tags={c.demos.aura[lens].tags} caption={c.demos.aura[lens].caption} state={state} />;
  if (demo === "nexus") return <NexusLiveDemo content={c.demos.nexus} state={state} />;
  return <MaestroLiveDemo content={c.demos.maestro} state={state} />;
}
