export function AppHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="app-heading">
      {eyebrow && <span className="app-heading__eyebrow mono">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}
