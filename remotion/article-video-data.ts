export type ArticleVideoProps = Readonly<{
  slug: string;
  title: string;
  summary: readonly string[];
  reviewedAt: string;
  sources: readonly Readonly<{publisher: string}>[];
}>;

export function validateArticleVideoProps(props: ArticleVideoProps): string[] {
  const errors: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(props.slug)) errors.push("Ungültiger Artikel-Slug.");
  if (props.title.length < 20 || props.title.length > 100) errors.push("Der Titel muss 20 bis 100 Zeichen lang sein.");
  if (props.summary.length < 3) errors.push("Mindestens drei geprüfte Kernaussagen sind erforderlich.");
  if (props.summary.slice(0, 3).some((item) => item.length < 30 || item.length > 220)) {
    errors.push("Die ersten drei Kernaussagen müssen jeweils 30 bis 220 Zeichen lang sein.");
  }
  if (props.sources.length < 2) errors.push("Mindestens zwei Quellen sind erforderlich.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(props.reviewedAt)) errors.push("Das Prüfdatum ist ungültig.");
  return errors;
}
