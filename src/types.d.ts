export type TMovie = {
  name: string;
  imdb_url: string;
  rating: number;
  year: number;
  image_url: string;
  thumb_url: string;
  desc: string;
  genre: string[];
  directors: string[];
};

export type TMoviesResponse = {
  items: TMovie[];
  total: number;
  nextPage: number;
  previousPage: number;
  totalPages: number;
};

export type TFilterParams = Partial<{
  search: string;
  genre: string;
  start_year: number;
  end_year: number;
  range: number;
}>;
