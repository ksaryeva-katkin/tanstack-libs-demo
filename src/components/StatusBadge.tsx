type StatusBadgeProps = {
  label: string;
};

export const StatusBadge = ({ label }: StatusBadgeProps) => (
  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-200">
    <span className="size-2 rounded-full bg-teal-300" />
    {label}
  </span>
);
