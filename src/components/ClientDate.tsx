"use client";

interface Props {
  date: string;
  month?: "long" | "short";
}

export function ClientDate({ date, month = "short" }: Props) {
  return (
    <span suppressHydrationWarning>
      {new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month,
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}
