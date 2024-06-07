import React, { useState, useEffect, useRef } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Button from "components/atoms/button";
import Select from "components/atoms/select/select";
import Input from "components/atoms/input/input";
import { useDebouncedEffect } from "hooks/useDebouncedEffect";
import { TFilterParams } from "src/types";

interface CHeader {
  filterMovies?: (params: TFilterParams) => void;
  showFavourites?: (show?: boolean) => void;
  showingFavs?: boolean;
}

const Header: React.FC<CHeader> = ({
  filterMovies,
  showFavourites,
  showingFavs,
}) => {
  const [open, setOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedStart, setSelectedStart] = useState<number>();
  const [selectedEnd, setSelectedEnd] = useState<number>();
  const [selectedRange, setSelectedRange] = useState<number>();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // fetch genres for listing
  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch("/api/data?action=fetch_genres");
      const genres = await res.json();
      setGenres(genres);
    };

    void fetchGenres();
  }, []);

  // if the mouse is clicked outside; close it
  useEffect(() => {
    function handleChangeOutSide(event: any) {
      if (!dropdownRef || !dropdownRef.current?.contains(event.target)) {
        if (!menuBtnRef || !menuBtnRef.current?.contains(event.target)) {
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleChangeOutSide);
    return () => document.removeEventListener("mousedown", handleChangeOutSide);
  }, []);

  useDebouncedEffect(
    () => {
      if (!search || search.length > 1) applyFilter();
    },
    [search],
    550
  );

  const resetForm = () => {
    setSelectedGenre("");
    setSelectedStart(undefined);
    setSelectedEnd(undefined);
    setSelectedRange(undefined);
    applyFilter(true);
    setOpen(false);
  };

  const applyFilter = (clear = false) => {
    if (clear) {
      if (filterMovies) filterMovies({});
      return;
    }
    if (filterMovies) {
      filterMovies({
        search,
        genre: selectedGenre,
        start_year: selectedStart,
        end_year: selectedEnd,
        range: selectedRange,
      });
    }
  };

  return (
    <header className="z-10 relative max-w-[42rem] mx-2 md:mx-auto flex flex-wrap md:flex-nowrap items-center">
      <div className="relative flex items-center flex-grow w-full">
        <button className="absolute right-2 focus:outline-none rtl:left-0 rtl:right-auto">
          <MagnifyingGlassIcon className="h-6 w-6 text-white" />
        </button>
        <input
          type="text"
          placeholder="Serach for a movie"
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full py-1.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-5 pr-11 rtl:pr-3 rtl:pl-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
        />
      </div>
      <div className="relative ml-0 mt-2 md:mt-0 md:ml-2 flex">
        <button
          ref={menuBtnRef}
          onClick={() => setOpen(!open)}
          type="button"
          className="relative z-10 flex items-center p-2 text-sm text-gray-600 bg-white border border-transparent rounded-md dark:text-white dark:bg-gray-800 focus:outline-none"
        >
          <span className="mx-1 whitespace-nowrap">Filter search by</span>
          <svg
            className="w-5 h-5 mx-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
        {showFavourites && (
          <Button
            type="button"
            onClick={() => showFavourites(!showingFavs)}
            btnType="secondary"
            className="ml-2"
          >
            {showingFavs ? "Show All" : "Show Favourites"}
          </Button>
        )}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-[2.3rem] right-0 left-0 z-20 w-full py-2 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl dark:bg-gray-800 p-3"
        >
          <form className="max-w-sm">
            <label
              htmlFor="genres"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select genre
            </label>
            <Select
              id="genres"
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option selected value="">
                All
              </option>
              {genres.map((genre) => (
                <option
                  key={genre}
                  value={genre}
                  selected={selectedGenre == genre}
                >
                  {genre}
                </option>
              ))}
            </Select>
          </form>
          <form className="max-w-sm mt-4">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Year rage
            </label>
            <div className="flex align-items-center">
              <Input
                type="number"
                pattern="[0-9]+"
                placeholder="start year"
                value={selectedStart || ""}
                onChange={(e) => setSelectedStart(parseInt(e.target.value))}
              />
              <Input
                type="number"
                pattern="[0-9]+"
                className="ml-3"
                placeholder="end year"
                value={selectedEnd || ""}
                onChange={(e) => setSelectedEnd(parseInt(e.target.value))}
              />
            </div>
          </form>
          <form className="max-w-sm mt-4">
            <label className="mb-1 text-sm font-medium text-gray-900 dark:text-white flex items-center justify-start">
              <span className="text-nowrap">Minimum rating</span>
              <Input
                type="number"
                pattern="[0-9]+"
                className="ml-3 mx-auto w-auto"
                max={10}
                placeholder="range"
                value={selectedRange || ""}
                onChange={(e) => setSelectedRange(Number(e.target.value))}
              />
            </label>
            <input
              id="default-range"
              type="range"
              min={1}
              max={10}
              step={0.5}
              defaultValue={8}
              value={selectedRange || 8}
              onChange={(e) => setSelectedRange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </form>
          <div className="mt-4 flex justify-between">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => applyFilter()}
                btnType="primary"
              >
                Apply
              </Button>
              <Button
                type="button"
                className="ml-3"
                btnType="secondary"
                onClick={() => resetForm()}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
