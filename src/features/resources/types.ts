export type ResourceCategory =
  "All" | "Documents" | "Guides" | "Family Resources" | "Educational Materials";

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: Exclude<ResourceCategory, "All">;
  fileName: string;
  fileSize: string;
  pdfUrl: string;
  publishedDate?: string;
  viewsCount?: number;
  isPopular?: boolean;
}
