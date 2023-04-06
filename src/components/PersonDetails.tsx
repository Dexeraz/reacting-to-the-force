import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { IPeople } from "../api/api";
import { fetchPeopleDetails, IPeopleDetails } from "../api/fetchPeopleDetails";

const PersonDetails: React.FC = () => {
  const { name } = useParams();
  const selectedPerson: IPeople | undefined = useAppSelector(
    (state) =>
      state.search.people.find(
        (person) => person.name.toLowerCase() === name.toLowerCase()
      )
  );
  const navigate = useNavigate();
  const [peopleDetails, setPeopleDetails] = useState<IPeopleDetails | null>(
    null
  );

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedPerson) {
        return;
      }
      const details = await fetchPeopleDetails(selectedPerson);
      setPeopleDetails(details);
    };
    fetchDetails();
  }, [selectedPerson]);

  if (!selectedPerson || !peopleDetails) {
    return <div>No person selected</div>;
  }

  return (
    <div>
      <h2>{selectedPerson.name}</h2>
      <p>Birth year: {selectedPerson.birth_year}</p>
      <p>Homeworld: {peopleDetails.homeworldName}</p>
      <p>Movies: {peopleDetails.filmTitles.join(", ")}</p>
      <p>Starships: {peopleDetails.starshipNames.join(", ")}</p>
      <p>Vehicles: {peopleDetails.vehicleNames.join(", ")}</p>

      <button
        onClick={goBack}
        className="px-4 py-2 text-white bg-blue-500 rounded-r hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  );
};

export default PersonDetails;
