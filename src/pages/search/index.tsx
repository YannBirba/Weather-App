import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { activeCity$, addedCities$ } from "~/states";
import { toast, ToastContainer } from "react-toastify";
import search1Image from "~/assets/search1.png";
import background from "~/assets/background.png";
import citiesJSON from "~/lib/city-list.json";
import "react-toastify/dist/ReactToastify.css";
import { ICity } from "~/types";
import { useRouter } from "next/router";

const cities = citiesJSON as ICity[];

const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<ICity>({
    id: 0,
    name: "",
    country: "",
    state: "",
    coord: {
      lon: 0,
      lat: 0,
    },
  }); // searchValue is the value of the input field
  const [results, setResults] = useState<ICity[]>([]); // results is the list of cities that match the searchValue
  const [isInputActive, setIsInputActive] = useState<boolean>(true); // activeInput is the input field that is active
  const inputRef = useRef<HTMLInputElement>(null); // inputRef is the ref of the input field

  useEffect(() => {
    if (searchValue.name === "") {
      setResults([]);
      return;
    }
    setResults(
      cities
        .filter((city: ICity) =>
          city.name.toLowerCase().includes(searchValue.name.toLowerCase()),
        )
        .slice(0, 4),
    );
  }, [searchValue]);

  return (
    <>
      <ToastContainer />
      <Head>
        <title>Search - Weather.io</title>
        <meta name="description" content="An faboulus weather website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src={background}
        alt="background"
        className="absolute w-full h-full -z-10 object-cover"
        fill
      />
      <div id="styles-setup" className="mt-80 w-full flex justify-center">
        <Image
          className="transform bg-[#383b53] border-solid border-[#2d3142] border-8 border-r-0 pt-3 pb-3 pl-3 w-1/36"
          src={search1Image}
          alt="search-icon"
          width={56}
          height={56}
        />

        <input
          className="w-5/12 bg-[#383b53] border-solid border-[#2d3142] border-8 border-l-0 pt-0.5 pb-0.5 outline-0 text-xl pl-3 text-white"
          autoFocus
          placeholder="Search for your location"
          type="text"
          onFocus={() => {
            setIsInputActive(true);
          }}
          value={searchValue.name}
          onBlur={() => {
            setIsInputActive(false);
          }}
          onChange={(event) => {
            setSearchValue((prevSearchValue) => {
              return {
                ...prevSearchValue,
                id: 0,
                name: event.target.value,
              };
            });
          }}
          ref={inputRef}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              let city: ICity | undefined = {
                id: 0,
                name: "",
                country: "",
                state: "",
                coord: {
                  lon: 0,
                  lat: 0,
                },
              };
              if (searchValue.id !== 0 && searchValue.country !== "") {
                city = cities.find((city: ICity) => city.id === searchValue.id);
              } else {
                city = cities.find(
                  (city: ICity) =>
                    city.name.toLowerCase() === searchValue.name.toLowerCase(),
                );
              }
              if (city) {
                if (
                  addedCities$
                    .get()
                    .find((value: ICity) => value.id === city!.id)
                ) {
                  toast.error("City already added");
                } else {
                  addedCities$.push(city);
                  activeCity$.set(city);
                  router.push("/home");
                }
              } else {
                toast.error("City not found");
              }
            }
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        {results.map((city: ICity) => {
          if (
            isInputActive &&
            city.name.toLowerCase().startsWith(searchValue.name.toLowerCase())
          ) {
            return (
              <div
                className={
                  isInputActive
                    ? "flex justify-between w-12+5/12 h-auto border-b-2 border-gray-400 text-amber-50 bg-[#383b53] p-5 hover: cursor-pointer z-20"
                    : "hidden"
                }
                key={city.id}
                onMouseDown={() => {
                  setSearchValue((prevSearchValue) => {
                    return {
                      ...prevSearchValue,
                      id: city.id,
                      name: city.name,
                      country: city.country,
                      state: city.state,
                      coord: {
                        lon: city.coord.lon,
                        lat: city.coord.lat,
                      },
                    };
                  });
                  setIsInputActive(false);
                  inputRef.current?.blur();
                }}
              >
                <p>
                  {city.name
                    .split("")
                    .map((letter: string, letterIndex: number) => (
                      <span
                        className={
                          letterIndex < searchValue.name.length
                            ? "font-bold"
                            : ""
                        }
                        key={letterIndex}
                      >
                        {letter}
                      </span>
                    ))}
                </p>
                {city.country}
              </div>
            );
          }
        })}
        <div className="absolute mt-24 left-1/2 transform -translate-x-1/2 w-full h-96">
          {searchValue.name.length > 0 ? (
            <button
              onClick={() => {
                let city: ICity | undefined = {
                  id: 0,
                  name: "",
                  country: "",
                  state: "",
                  coord: {
                    lon: 0,
                    lat: 0,
                  },
                };
                if (searchValue.id !== 0 && searchValue.country !== "") {
                  city = cities.find(
                    (city: ICity) => city.id === searchValue.id,
                  );
                } else {
                  city = cities.find(
                    (city: ICity) =>
                      city.name.toLowerCase() ===
                      searchValue.name.toLowerCase(),
                  );
                }
                if (city) {
                  if (
                    addedCities$
                      .get()
                      .find((value: ICity) => value.id === city!.id)
                  ) {
                    toast.error("City already added");
                  } else {
                    addedCities$.push(city);
                    activeCity$.set(city);
                    router.push("/home");
                  }
                } else {
                  toast.error("City not found");
                }
              }}
              className="absolute z-10 bottom-14 right-16 w-44 h-12 text-white bg-[#2d3142] rounded text-2xl hover:shadow-2xl transition duration-500 ease-in-out"
            >
              <p>{"Continue ->"}</p>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Search;
