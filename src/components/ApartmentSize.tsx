import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Path } from "react-hook-form";
import { calculateTypeSqFt, calculateRoomsSqFt } from "../utils/utils";
import type { FormValues } from "../utils/utils";
import "./ApartmentSize.scss";
import { ErrorMessage } from "@hookform/error-message";

export default function ApartmentSize(): JSX.Element {
  const [aptSize, setAptSize] = useState<string | null>(null);
  const [rent, setRent] = useState<string | null>(null);
  const [yourSpaceSqFt, setYourSpaceSqFt] = useState<string | null>(null);
  const [percentageOfApartmentYouUse, setPercentageOfApartmentYouUse] =
    useState<string | null>(null);
  const [calResultRef, setCalcResultRef] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({ criteriaMode: "all" });

  const onSubmit = (data: FormValues) => {
    const aptSqFoot = calculateRoomsSqFt(data.rooms || []);
    const sharedSqFoot = calculateTypeSqFt(data.rooms || [], "shared");
    const yourSqFt = calculateTypeSqFt(data.rooms || [], "yours");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theirSqFt = calculateTypeSqFt(data.rooms || [], "theirs");

    const yourUsablePortion = sharedSqFoot / 2 + yourSqFt;
    const percentageOfApartment = aptSqFoot ? yourUsablePortion / aptSqFoot : 0;
    const yourShareOfTheRent = (Number(data.rent) || 0) * percentageOfApartment;

    setYourSpaceSqFt(yourUsablePortion.toFixed(2));
    setAptSize(aptSqFoot.toFixed(2));
    setPercentageOfApartmentYouUse(percentageOfApartment.toFixed(2));
    setRent(yourShareOfTheRent.toFixed(2));
    setCalcResultRef((prev) => prev + 1);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const clearRooms = () => {
    setAptSize(null);
    setRent(null);
    setYourSpaceSqFt(null);
    reset({ rent: null });
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset name="rent" className="rent">
          <label>
            Rent $$$:
            <input
              type="number"
              {...register("rent", {
                required: "This input is required.",
                pattern: {
                  value: /\d+/,
                  message: "This input is number only.",
                },
              })}
            />
            <ErrorMessage
              errors={errors}
              name="rent"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p key={type} className="error">
                    {message}
                  </p>
                ))
              }
            />
          </label>
        </fieldset>
        <div className="add-button">
          <div className="note">* please use feet</div>
          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                length: undefined,
                width: undefined,
                type: undefined,
              })
            }
          >
            + Add Room
          </button>
        </div>
        {fields.map((item, index) => {
          const fieldName = `rooms[${index}]`;
          return (
            <fieldset name={fieldName} key={fieldName} className="room">
              <div>
                <button
                  type="button"
                  id="closeButton"
                  onClick={() => remove(index)}
                  style={{ height: 0 }}
                >
                  &#10006;
                </button>
              </div>
              <label id="nameLabel">
                Name:
                <input
                  type="text"
                  {...register(
                    `${fieldName}.name` as Path<FormValues>,
                    { required: true } as any,
                  )}
                />
              </label>
              <div className="space">Space:</div>

              <div id="spaceSetting">
                <label className="room-type">
                  <input
                    type="radio"
                    value="yours"
                    {...register(`${fieldName}.type` as any, {
                      required: true,
                    })}
                  />
                  yours (private)
                </label>

                <label className="room-type">
                  <input
                    type="radio"
                    value="shared"
                    {...register(`${fieldName}.type` as any, {
                      required: true,
                    })}
                  />
                  shared (public)
                </label>

                <label className="room-type">
                  <input
                    type="radio"
                    value="theirs"
                    {...register(`${fieldName}.type` as any, {
                      required: true,
                    })}
                  />
                  theirs (private)
                </label>
              </div>
              <label>
                Length:
                <input
                  type="number"
                  {...register(
                    `${fieldName}.length` as Path<FormValues>,
                    {
                      required: "This input is required.",
                      pattern: {
                        value: /\d+/,
                        message: "This input is number only.",
                      },
                    } as any,
                  )}
                />
              </label>

              <label>
                Width:
                <input
                  type="number"
                  {...register(
                    `${fieldName}.width` as Path<FormValues>,
                    {
                      required: "This input is required.",
                      pattern: {
                        value: /\d+/,
                        message: "This input is number only.",
                      },
                    } as any,
                  )}
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
          <div className="css-typing" key={calResultRef}>
            {aptSize ? (
              <>
                <h2>
                  Apartment Size is {aptSize} ft<sup>2</sup>
                </h2>
                <h2>
                  Your Space is {yourSpaceSqFt} ft<sup>2</sup>
                </h2>
                <h2>
                  which is around{" "}
                  {(Number(percentageOfApartmentYouUse) * 100).toFixed(0)}%
                </h2>

                {rent !== null && (
                  <h2 className="share">Your Share of the Rent is ${rent}</h2>
                )}
              </>
            ) : (
              <h2 className="empty">...</h2>
            )}
          </div>
          {
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
              {new Array(6).fill(0).map(() => (
                <div className="four-buttons">
                  {new Array(4).fill(0).map(() => (
                    <div />
                  ))}
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </section>
  );
}
