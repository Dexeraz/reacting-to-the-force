import { useLocation } from "react-router-dom";
import {
  useGetPlanetQuery,
  useGetFilmQuery,
  useGetVehicleQuery,
  useGetStarshipQuery,
} from "../api/starWarsApi";
import Loading from "./Loading";

const PersonDetails = () => {
  const { state } = useLocation();
  const person = state.person;

  if (!person) {
    return <div>Person not found</div>;
  }
  const getPersonId = (url: string) => {
    const match = url.match(/\/api\/people\/(\d+)/);
    return match ? match[1] : null;
  };

  const personId = getPersonId(person.url);
  const imageUrl = `https://starwarsapibucket.s3.eu-central-1.amazonaws.com/${personId}.jpg`;

  // Homeworld
  const homeworldId = person.homeworld.split("/").slice(-2, -1)[0];
  const { data: homeworldData } = useGetPlanetQuery(homeworldId);
  // Films
  const filmIds = person.films.map(
    (film: string) => film.split("/").slice(-2, -1)[0]
  );
  const filmQueries = filmIds.map((id: string) => useGetFilmQuery(id));
  const films = filmQueries
    .map((query: ReturnType<typeof useGetFilmQuery>) => query.data?.title)
    .filter(Boolean);

  // Vehicles
  const vehicleIds = person.vehicles.map(
    (vehicle: string) => vehicle.split("/").slice(-2, -1)[0]
  );
  const vehicleQueries = vehicleIds.map((id: string) => useGetVehicleQuery(id));
  const vehicles = vehicleQueries
    .map((query: ReturnType<typeof useGetVehicleQuery>) => query.data?.name)
    .filter(Boolean);

  // Starships
  const starshipIds = person.starships.map(
    (starship: string) => starship.split("/").slice(-2, -1)[0]
  );
  const starshipQueries = starshipIds.map((id: string) =>
    useGetStarshipQuery(id)
  );
  const starships = starshipQueries
    .map((query: ReturnType<typeof useGetStarshipQuery>) => query.data?.name)
    .filter(Boolean);

  return (
    <div className="bg-black shadow-lg rounded-lg overflow-hidden w-full mx-auto mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={person.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            {person.name}
          </h2>
          <p className="text-gray-400 mb-2">Birth year: {person.birth_year}</p>
          <p className="text-gray-400 mb-2">Height: {person.height} cm</p>
          <p className="text-gray-400 mb-2">Mass: {person.mass} kg</p>
          <div className="text-gray-400 mb-2">
            Homeworld: {homeworldData?.name || <Loading />}
          </div>
          <div className="text-gray-400 mb-2">
            Films: {films.length ? films.join(", ") : <Loading />}
          </div>
          <div className="text-gray-400 mb-2">
            Vehicles: {vehicles.length ? vehicles.join(", ") : <Loading />}
          </div>
          <div className="text-gray-400 mb-2">
            Starships: {starships.length ? starships.join(", ") : <Loading />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
