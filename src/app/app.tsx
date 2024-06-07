import { BookmarkIcon } from "@heroicons/react/24/outline";
import { truncate } from "../utils/utils";
import Header from "./header";
import Skeleton from "./skeleton";
import Button from "components/atoms/button";
import useMovies from "./movies-hook";

function App() {
  const [
    filteredMovies,
    loading,
    showingFavs,
    filterMovies,
    showFavourites,
    addToFavourite,
    isFavourite,
    nextPage,
  ] = useMovies();

  return (
    <main className="py-9">
      <Header
        filterMovies={filterMovies}
        showFavourites={showFavourites}
        showingFavs={showingFavs}
      />
      <div className="relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 gap-1 xl:gap-2 mt-8 xl:mt-12 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 justify-items-center">
          {filteredMovies.map((movie) => {
            const isFav = isFavourite(movie);

            return (
              <div
                key={movie.imdb_url + String(Math.random())}
                className="max-w-sm md:w-full overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 relative"
              >
                <img
                  className="object-contain w-full h-48 mt-2"
                  src={movie.image_url}
                  alt={movie.name}
                />

                <div className="px-4 py-2 pb-8">
                  <h1
                    className="text-sm font-bold text-gray-800 uppercase dark:text-white"
                    title={movie.name}
                  >
                    {truncate(movie.name, 20)}
                  </h1>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {truncate(movie.desc, 80)}
                  </p>
                  <div className="mt-2 absolute w-auto left-2 right-2 bottom-2 text-xs flex items-center justify-between text-gray-800 dark:text-white">
                    <span className="font-semibold bg-yellow-800 px-1">
                      {movie.rating}
                    </span>
                    <span className="font-semibold bg-blue-800 px-1">
                      {movie.year}
                    </span>
                  </div>
                </div>

                <button className="absolute top-0 right-[-16px] outline-none focus:outline-none rtl:left-0 rtl:right-auto mx-4">
                  <BookmarkIcon
                    fill="#0000af"
                    stroke="white"
                    fillOpacity={isFav ? 1 : 0}
                    className="h-8 w-8"
                    title="Add to favorite"
                    onClick={() => addToFavourite(movie, !isFav)}
                  />
                </button>
              </div>
            );
          })}
          {loading && <Skeleton />}
          {!loading && !showingFavs && (
            <div className="max-w-sm md:w-full overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-600 flex items-center justify-center">
              <Button
                type="button"
                className="text-sm"
                onClick={() => nextPage()}
              >
                Click to load more
              </Button>
            </div>
          )}
        </div>
        {!filteredMovies.length && !loading && (
          <div className="font-bold text-gray-800 dark:text-white text-xl">
            No results found
            <p className="text-sm font-normal">
              Search and filters are only applied on fetched results
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
