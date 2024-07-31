import { DropdownChangeEvent } from "primereact/dropdown";
import { Calendar, CalendarViewChangeEvent } from "primereact/calendar";
import { ChangeEvent, useState } from "react";

export const useForm = (
  submitHandler: (values: any) => void,
  initialValues: any
) => {
  const [values, setValues] = useState(initialValues);

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | DropdownChangeEvent
  ) => {
    setValues((state: any) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const updateValues = (newValues: any) => {
    setValues(newValues);
  };

  const onSubmit = (e?: any) => {
    if (e) {
      e.preventDefault();
    }

    submitHandler(values);
  };

  return {
    values,
    onChange,
    updateValues,
    onSubmit,
    setValues,
  };
};
