
export interface Game {
  id: number;
  title: string;
  category: GameCategory;
  imageUrl: string;
  gameUrl: string;
  rating: number;
  popularity: number; // e.g., number of plays
  releaseDate: string; // ISO 8601 format: "YYYY-MM-DD"
  description: string;
}

export enum GameCategory {
  ALL = 'All',
  RACING = 'Racing',
  SHOOTING = 'Shooting',
  PUZZLE = 'Puzzle',
  ADVENTURE = 'Adventure',
  ARCADE = 'Arcade',
  HYPERCASUAL = 'Hypercasual',
}

export enum SortOption {
  NEWEST = 'newest',
  POPULAR = 'popular',
  RATING = 'rating',
  ALPHABETICAL = 'alphabetical',
}

export enum ViewMode {
  GRID = 'grid',
  LIST = 'list',
}