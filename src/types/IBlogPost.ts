export type IBlogStatus = "AKTYWNY" | "NIEAKTYWNY";

/** Row of `blog` with its `blog_pliki` attachment URLs. */
export interface IBlogPost {
  id: number;
  tytul: string;
  slug: string;
  tresc: string;
  status: IBlogStatus;
  data_utworzenia: string;
  attachments: string[];
}

export interface IBlogPostRequest {
  tytul: string;
  slug: string;
  tresc: string;
  status?: IBlogStatus;
  attachments?: string[];
}
