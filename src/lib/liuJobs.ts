export interface LiUJob {
  title: string;
  href: string;
  deadline: string;
  department: string;
  tag: string;
}

const AI_DEPARTMENTS = ["IDA", "ISY", "MAI", "NAISS", "IMT"];

function deriveTag(title: string, occupationArea: string): string {
  const t = title.toLowerCase();
  if (t.includes("phd") || t.includes("doctoral") || occupationArea.toLowerCase().includes("phd")) return "PhD";
  if (t.includes("postdoc") || t.includes("post-doc")) return "Postdoc";
  if (t.includes("professor")) return "Professor";
  if (t.includes("engineer")) return "Engineer";
  if (t.includes("research")) return "Research";
  return "Position";
}

function formatDeadline(rssDate: string): string {
  const d = new Date(rssDate);
  if (isNaN(d.getTime())) return rssDate;
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
  return m ? m[1].trim() : "";
}

export async function fetchLiUJobs(): Promise<LiUJob[]> {
  try {
    const res = await fetch("https://liu.se/rss/liu-jobs-en.rss", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const itemBlocks = xml.split("<item>").slice(1);
    const jobs: LiUJob[] = [];

    for (const block of itemBlocks) {
      const org = extractTag(block, "Org1");
      if (!AI_DEPARTMENTS.some((d) => org.startsWith(d))) continue;

      const title = extractTag(block, "title");
      const linkMatch = block.match(/<link>([^<]+)<\/link>/);
      const href = linkMatch ? linkMatch[1].replace(/&amp;/g, "&") : "";
      const deadlineRaw = extractTag(block, "pubDateTo");
      const deadline = formatDeadline(deadlineRaw);
      const occupationArea = extractTag(block, "occupationArea");

      if (!title || !href) continue;

      jobs.push({ title, href, deadline, department: org, tag: deriveTag(title, occupationArea) });
    }

    return jobs.filter((j) => j.tag !== "Professor");
  } catch {
    return [];
  }
}
