export function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }
  ) {
    const base =
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition";
    const styles =
      props.variant === "ghost"
        ? "bg-transparent hover:bg-black/5"
        : "bg-black text-white hover:bg-black/90";
    return <button {...props} className={`${base} ${styles} ${props.className ?? ""}`} />;
  }
  