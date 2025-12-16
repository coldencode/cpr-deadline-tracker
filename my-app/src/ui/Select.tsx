export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
      <select
        {...props}
        className={
          "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 " +
          (props.className ?? "")
        }
      />
    );
  }
  