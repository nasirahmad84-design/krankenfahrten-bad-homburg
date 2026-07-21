export type LegalDefinition = Readonly<{
  term: string;
  description: string;
}>;
export type LegalSectionContent = Readonly<{
  id: string;
  title: string;
  paragraphs?: readonly string[];
  definitions?: readonly LegalDefinition[];
  items?: readonly string[];
}>;
