export function Card(props: React.PropsWithChildren<{ className?: string }>) {
    return (
      <div className={"rounded-2xl border bg-white shadow-sm " + (props.className ?? "")}>
        {props.children}
      </div>
    );
  }
  