import axios from "axios";

export interface Movie {
  Title: string;
  Poster: string;
  imdbID: string;
}

export interface DetailedMovie {
  imdbID: string;
  Title: string;
  Poster: string;
  Plot: string;
  Ratings: [{ Source: string; Value: string }];
  Metascore: string;
  imdbRating: string;
  Type: string;
}

export default axios.create({
  baseURL: "http://www.omdbapi.com",
});
