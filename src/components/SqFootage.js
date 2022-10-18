import { useForm, Controller } from "react-hook-form";
import { Input, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { calculateSqFt } from "../utils/index";
import "./SqFootage.scss";

export default function SqFootage() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const self = useController();

  return (
    <>
      <form onSubmit={handleSubmit(self.onSubmit)}>
        <label for="length">Length</label>
        <Controller
          name="length"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              hiddenLabel
              id="length"
              type="number"
              variant="outlined"
              InputLabelProps={{
                shrink: false,
              }}
            />
          )}
        />
        <label for="width">Width</label>
        <Controller
          name="width"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              hiddenLabel
              type="number"
              variant="outlined"
              id="width"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        {/* errors will return when field validation fails  */}
        {errors.length && <p>This field is required</p>}
        {errors.width && <p>This field is required</p>}
        <input type="submit" />
      </form>

      {self.sqFt && (
        <h2>
          {self.sqFt} ft<sup>2</sup>
        </h2>
      )}
    </>
  );
}

function useController() {
  const [sqFt, setSqFt] = useState(null);
  const onSubmit = (data) => {
    setSqFt(calculateSqFt(data.length, data.width));
  };

  return {
    onSubmit,
    sqFt,
  };
}
