import { useForm } from "react-hook-form";
import { useState } from "react";
import { calculateSqFt, calculateTotalSqFt } from "../utils/index";
import "./ApartmentSize.scss";

export default function ApartmentSize() {
  const [indexes, setIndexes] = useState([]);
  const [aptSize, setAptSize] = useState(null);
  const [rent, setRent] = useState(null);
  const [yourSpaceSqFt, setYourSpaceSqFt] = useState(null);

  const [counter, setCounter] = useState(0);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const aptSqFoot = data.rooms.map((room) =>
      calculateSqFt(room.length, room.width)
    );
    const sharedSqFoot = data.rooms
      .filter((room) => room.shared)
      .map((room) => calculateSqFt(room.length, room.width));
    const yourSpFt = data.rooms
      .filter((room) => room.yours)
      .map((room) => calculateSqFt(room.length, room.width));

    const apartmentSize = calculateTotalSqFt(aptSqFoot);
    const yourSize = calculateTotalSqFt(yourSpFt);
    const sharedSize = calculateTotalSqFt(sharedSqFoot);

    const yourPortion = (sharedSize / 2 + yourSize) / apartmentSize;
    const yourShareOfTheRent = data.rent * yourPortion;

    setYourSpaceSqFt(yourSize.toFixed(2));
    setAptSize(apartmentSize.toFixed(2));
    setRent(yourShareOfTheRent.toFixed(2));
  };

  const addRoom = () => {
    setIndexes((prevIndexes) => [...prevIndexes, counter]);
    setCounter((prevCounter) => prevCounter + 1);
  };

  const removeRoom = (index) => () => {
    setIndexes((prevIndexes) => [
      ...prevIndexes.filter((item) => item !== index),
    ]);
    setCounter((prevCounter) => prevCounter - 1);
  };

  const clearRooms = () => {
    setIndexes([]);
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset name="rent" className="rent">
          <label>
            Rent:
            <input type="number" {...register("rent", { required: true })} />
          </label>
        </fieldset>
        <p>Apartment</p>
        {indexes.map((index) => {
          const fieldName = `rooms[${index}]`;
          return (
            <fieldset name={fieldName} key={fieldName} className="room">
              <div>
                <button
                  type="button"
                  id="closeButton"
                  onClick={removeRoom(index)}
                >
                  &#10006;
                </button>
              </div>

              <label>
                Your room?
                <input type="checkbox" {...register(`${fieldName}.yours`)} />
              </label>

              <label>
                Shared space?
                <input type="checkbox" {...register(`${fieldName}.shared`)} />
              </label>

              <label id="nameLabel">
                Name:
                <input
                  type="text"
                  {...register(`${fieldName}.name`, { required: true })}
                />
              </label>

              <label>
                Length:
                <input
                  type="number"
                  {...register(`${fieldName}.length`, { required: true })}
                />
              </label>

              <label>
                Width:
                <input
                  type="number"
                  {...register(`${fieldName}.width`, { required: true })}
                />
              </label>
            </fieldset>
          );
        })}
        <div>
          <button type="button" onClick={addRoom}>
            Add Room
          </button>
          <button type="button" onClick={clearRooms}>
            Clear All
          </button>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>

      <div className="results">
        <div>
          {aptSize && (
            <>
              <h2>
                Apartment Size is {aptSize} ft<sup>2</sup>
              </h2>
              <h2>
                Your Space is {yourSpaceSqFt} ft<sup>2</sup>
              </h2>
              <p>which is around</p>
              <h3>{(yourSpaceSqFt / aptSize) * 100}%</h3>
            </>
          )}
          {rent !== null && <h2>Your Share of the Rent is ${rent}</h2>}
        </div>
      </div>
    </section>
  );
}
