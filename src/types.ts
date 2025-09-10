export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
  // Add any other fields you might need from the API for display or debugging
}

export interface ApiPagination {
  total: number;
  limit: number; // records per page
  offset: number; // current offset
  total_pages: number;
  current_page: number;
  next_url: string | null;
}

export interface ApiResponse {
  data: Artwork[];
  pagination: ApiPagination;
  // config: any; // You can ignore this or define if needed
}

// Minimal type for selected artworks to save memory
export type SelectedArtworkMinimal = Pick<Artwork, 'id' | 'title' | 'artist_display'>;