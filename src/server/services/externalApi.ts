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
  Genre: string;
  Released: string;
  Runtime: string;
}

export const poster = () =>
  axios.create({
    baseURL: "http://img.omdbapi.com",
  });

export default axios.create({
  baseURL: "http://www.omdbapi.com",
});
