export interface BlogAuthor {
  name: string;
  image: string;
  title?: string;
  bio?: string;
  quote?: string;
  company?: string;
  companyLogo?: string;
  storyUrl?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
  description?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  summary: string;
  image?: string;
  dateIso: string;
  dateFormatted: string;
  category: BlogCategory;
  authors: BlogAuthor[];
}

export interface BlogPostHeading {
  id: string;
  title: string;
}

export interface BlogPost extends BlogPostMeta {
  headings?: BlogPostHeading[];
  articleHtml?: string;
}
