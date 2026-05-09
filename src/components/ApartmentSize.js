import { useForm } from "react-hook-form";
import { useState } from "react";
import { calculateSqFt } from "../utils/index";
import "./ApartmentSize.scss";

export default function ApartmentSize() {
  const [indexes, setIndexes] = useState([]);
  const [aptSize, setAptSize] = useState(null);
  const [rent, setRent] = useState(null);
  const [yourSpaceSqFt, setYourSpaceSqFt] = useState(null);
  const [percentageOfApartmentYouUse, setPercentageOfApartmentYouUse] =
    useState(null);
  const [resultKey, setResultKey] = useState(0);

  const [counter, setCounter] = useState(0);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    const aptSqFoot = data.rooms.map((room) =>
      calculateSqFt(room.length, room.width),
    );

    const sharedSqFoot = data.rooms
      .filter((room) => room.type === "shared")
      .map((room) => calculateSqFt(room.length, room.width))
      .reduce((acc, currentValue) => {
        return acc + currentValue;
      }, 0);
    const yourSpFt = data.rooms
      .filter((room) => room.type === "yours")
      .map((room) => calculateSqFt(room.length, room.width))
      .reduce((acc, currentValue) => {
        return acc + currentValue;
      }, 0);
    const theirSqFt = data.rooms
      .filter((room) => room.type === "theirs")
      .map((room) => calculateSqFt(room.length, room.width))
      .reduce((acc, currentValue) => {
        return acc + currentValue;
      }, 0);

    const apartmentSize = aptSqFoot.reduce((acc, currentValue) => {
      return acc + currentValue;
    }, 0);
    console.log("aptSqFoot: ", aptSqFoot);
    console.log("apartmentSize: ", apartmentSize);
    console.log("yourSpFt: ", yourSpFt);
    console.log("sharedSqFoot: ", sharedSqFoot);
    console.log("theirSqFt: ", theirSqFt);
    console.log("data.rent: ", data.rent);

    const yourUsablePortion = sharedSqFoot / 2 + yourSpFt;
    const percentageOfApartment = yourUsablePortion / apartmentSize;
    const yourShareOfTheRent = data.rent * percentageOfApartment;

    console.log("yourUsablePortion: ", yourUsablePortion);
    console.log("yourShareOfTheRent: ", yourShareOfTheRent);
    console.log("percentageOfApartment: ", percentageOfApartment);
    console.log("percentageOfApartmentYouUse: ", percentageOfApartmentYouUse);

    setYourSpaceSqFt(yourUsablePortion.toFixed(2));
    setAptSize(apartmentSize.toFixed(2));
    setPercentageOfApartmentYouUse(percentageOfApartment.toFixed(2));
    setRent(yourShareOfTheRent.toFixed(2));
    setResultKey((prevKey) => prevKey + 1);
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
    setAptSize(null);
    setRent(null);
    setYourSpaceSqFt(null);
    reset({ rent: "" });
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset name="rent" className="rent">
          <label>
            Rent $$$:
            <input type="number" {...register("rent", { required: true })} />
          </label>
        </fieldset>
        <div className="add-button">
          <div className="note">* please use feet</div>
          <button type="button" onClick={addRoom}>
            + Add Room
          </button>
        </div>
        {indexes.map((index) => {
          const fieldName = `rooms[${index}]`;
          return (
            <fieldset name={fieldName} key={fieldName} className="room">
              <div>
                <button
                  type="button"
                  id="closeButton"
                  onClick={removeRoom(index)}
                  style={{ height: 0 }}
                >
                  &#10006;
                </button>
              </div>
              <label id="nameLabel">
                Name:
                <input
                  type="text"
                  {...register(`${fieldName}.name`, { required: true })}
                />
              </label>
              <div className="space">Space:</div>

              <div id="spaceSetting">
                <label className="room-type">
                  <input
                    type="radio"
                    value="yours"
                    {...register(`${fieldName}.type`, { required: true })}
                  />
                  yours (private)
                </label>

                <label className="room-type">
                  <input
                    type="radio"
                    value="shared"
                    {...register(`${fieldName}.type`, { required: true })}
                  />
                  shared (public)
                </label>

                <label className="room-type">
                  <input
                    type="radio"
                    value="theirs"
                    {...register(`${fieldName}.type`, { required: true })}
                  />
                  theirs (private)
                </label>
              </div>
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
          <button className="submit" type="button" onClick={clearRooms}>
            Clear
          </button>
          <input className="submit" type="submit" value="Submit" />
        </div>
      </form>

      <div className="results">
        <div className="border-yellow">
          {aptSize && (
            <div className="css-typing" key={resultKey}>
              {aptSize && (
                <>
                  <h2>
                    Apartment Size is {aptSize} ft<sup>2</sup>
                  </h2>
                  <h2>
                    Your Space is {yourSpaceSqFt} ft<sup>2</sup>
                  </h2>
                  <h2>
                    which is around{" "}
                    {(percentageOfApartmentYouUse * 100).toFixed(0)}%
                  </h2>
                </>
              )}
              {rent !== null && (
                <h2 className="share">Your Share of the Rent is ${rent}</h2>
              )}
            </div>
          )}
          {aptSize && (
            <div className="calculator">
              <div className="four-buttons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="second-buttons">
                <div className="calc-row-buttons">
                  <div></div>
                  <div></div>
                </div>
                <div className="calc-row-buttons">
                  <div></div>
                  <div></div>
                </div>
                <div style={{ border: "none" }}>
                  <div className="calculator-pad">
                    <div className="pad-row">
                      <button type="button" className="arrow-key arrow-up">
                        ↑
                      </button>
                    </div>
                    <div className="pad-row">
                      <button type="button" className="arrow-key arrow-left">
                        ←
                      </button>
                      <button type="button" className="arrow-key arrow-right">
                        →
                      </button>
                    </div>
                    <div className="pad-row">
                      <button type="button" className="arrow-key arrow-down">
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="four-buttons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="four-buttons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="four-buttons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="four-buttons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="four-buttons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="four-buttons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
