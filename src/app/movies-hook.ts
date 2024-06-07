import { useCallback, useEffect, useState } from "react";
import { TFilterParams, TMovie } from "src/types";

const useMovies = () => {
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [movies, setMovies] = useState<TMovie[]>([]); // holds all api data
  const [filteredMovies, setFilteredMovies] = useState<TMovie[]>([]); // holds filtered api data (excludes bookmarked items)
  const [bmMovies, setBmMovies] = useState<TMovie[]>([]); // holds bookmarked movies
  const [filterParams, setFilterParams] = useState<TFilterParams>();
  const [favs, setFavs] = useState<string[]>([]);
  const [showingFavs, setShowingFavs] = useState(false);

  // pull favourite ids on component mount
  useEffect(() => {
    let ids: string[];
    try {
      ids = JSON.parse(localStorage.getItem("favourite_movies_ids") || "[]");
    } catch (e) {
      console.error(e);
      ids = [];
    }
    setFavs(ids);
  }, []);

  // fetch movies via api whenever pageNo changes
  useEffect(() => {
    let mounted = true;
    const fetchMovies = async () => {
      setLoading(true);
      const res = await fetch(`/api/data?pageNo=${pageNo}`);
      const movies = await res.json();
      if (!movies || !movies.nextPage) {
        setReachedEnd(true);
      }
      if (movies && movies.items?.length && mounted) {
        setMovies((m) => m.concat(movies.items));
      }
      setLoading(false);
    };

    void fetchMovies();

    return () => {
      mounted = false;
    };
  }, [pageNo]);

  // once scrolled to the end; increment pageNo
  useEffect(() => {
    const onScroll = () => {
      if (
        !loading &&
        !reachedEnd &&
        !showingFavs &&
        window.innerHeight + Math.round(window.scrollY) + 2 >=
          document.body.offsetHeight
      ) {
        setPageNo(pageNo + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pageNo, loading, reachedEnd, showingFavs]);

  // filter movies whenever filterparams change, movies list updates, or showing favourite
  useEffect(() => {
    if (movies.length) {
      filterMovies(filterParams || {});
    }
  }, [movies, filterParams, showingFavs]);

  // filter is applied on originally fetched movies
  const filterMovies = useCallback(
    (params: TFilterParams) => {
      setFilterParams(params);

      const moviesToBeFiltered = showingFavs ? bmMovies : movies;

      // if no filter param is passed; reset to all movies list
      if (Object.keys(params).length === 0) {
        setFilteredMovies(moviesToBeFiltered);
        return;
      }

      let regexSearch: RegExp, regexGenre: RegExp;
      if (params["search"]) regexSearch = new RegExp(params["search"], "i");
      if (params["genre"]) regexGenre = new RegExp(params["genre"], "i");

      const newMovies = moviesToBeFiltered.filter((movie) => {
        let include = true;

        if (regexSearch && movie.name?.search(regexSearch) < 0) {
          include = false;
        }

        if (regexGenre && movie.genre?.join("|").search(regexGenre) < 0) {
          include = false;
        }

        if (params["start_year"] && movie.year < params["start_year"]) {
          include = false;
        }

        if (params["end_year"] && movie.year > params["end_year"]) {
          include = false;
        }

        if (params["range"] && movie.rating < params["range"]) {
          include = false;
        }

        return include;
      });

      setFilteredMovies(newMovies);
    },
    [movies, bmMovies, showingFavs]
  );

  const showFavourites = useCallback(
    (show = true) => {
      let items: any[];
      try {
        items = JSON.parse(localStorage.getItem("favourite_movies") || "[]");
      } catch (e) {
        console.error(e);
        items = [];
      }

      if (items.length) {
        if (show) {
          setFilteredMovies(items);
          setBmMovies(items);
          setShowingFavs(true);
        } else {
          setShowingFavs(false);
        }
      }
    },
    [movies]
  );

  const addToFavourite = useCallback((movie: TMovie, add = true) => {
    let items: any[];
    let ids: string[];
    try {
      items = JSON.parse(localStorage.getItem("favourite_movies") || "[]");
      ids = JSON.parse(localStorage.getItem("favourite_movies_ids") || "[]");
    } catch (e) {
      console.error(e);
      items = [];
      ids = [];
    }
    if (add) {
      items = [...items, movie];
      ids.push(movie.imdb_url);
    } else {
      items = items.filter((item) => item.imdb_url != movie.imdb_url);
      ids = ids.filter((id) => id != movie.imdb_url);
    }
    localStorage.setItem("favourite_movies", JSON.stringify(items));
    localStorage.setItem("favourite_movies_ids", JSON.stringify(ids));
    setFavs(ids);
  }, []);

  const isFavourite = useCallback(
    (movie: TMovie) => {
      return favs.includes(movie.imdb_url);
    },
    [favs.length]
  );

  const nextPage = useCallback(() => {
    setPageNo(pageNo + 1);
  }, [pageNo]);

  return [
    filteredMovies,
    loading,
    showingFavs,
    filterMovies,
    showFavourites,
    addToFavourite,
    isFavourite,
    nextPage,
  ] as const;
};

export default useMovies;
