type SectionSeparatorProps = {
  label: string;
  /** Background utility class of the surrounding sections (legacy alternates surfaces). */
  bgClassName?: string;
};

/** Decorative labeled divider between homepage sections (legacy .sep-line). */
export default function SectionSeparator({
  label,
  bgClassName = "bg-surface",
}: SectionSeparatorProps) {
  return (
    <div
      className={`px-margin-mobile md:px-margin-tablet lg:px-margin-desktop ${bgClassName}`}
    >
      <div className="sep-line" aria-hidden="true">
        <div className="sep-line-track" />
        <div className="sep-diamond" />
        <span className="sep-text">{label}</span>
        <div className="sep-diamond" />
        <div className="sep-line-track" />
      </div>
    </div>
  );
}
