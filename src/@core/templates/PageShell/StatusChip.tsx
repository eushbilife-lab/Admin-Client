type ChipTone = "ok" | "warn" | "danger" | "info";

export default function StatusChip({
  label,
  tone = "info",
}: {
  label: string;
  tone?: ChipTone;
}) {
  return <span className={`status-chip is-${tone}`}>{label}</span>;
}
