import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { schemaTypes } from "@/sanity/schemas";

export default defineConfig({
  name: "liuais",
  title: "LiU AI Society",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool(), colorInput()],
  schema: { types: schemaTypes },
  basePath: "/studio",
});
