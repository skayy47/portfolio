"use client";

import { ProjectId } from "@/lib/content";
import { useLang } from "@/components/providers/LangProvider";
import { AuraLiveDemo } from "./AuraLiveDemo";
import { NexusLiveDemo } from "./NexusLiveDemo";
import { MaestroLiveDemo } from "./MaestroLiveDemo";

/** Dispatches the right live demo for a project. */
export function LiveDemo({ demo }: { demo: ProjectId }) {
  const { c } = useLang();
  if (demo === "aura") return <AuraLiveDemo tags={c.demos.aura.tags} caption={c.demos.aura.caption} />;
  if (demo === "nexus") return <NexusLiveDemo content={c.demos.nexus} />;
  return <MaestroLiveDemo content={c.demos.maestro} />;
}
