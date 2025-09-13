
import { DropdownChangeEvent } from "primereact/dropdown";
import { ChangeEvent, useState } from "react";

// TODO: refactor to params
export const useForm = (
  submitHandler: (values: any) => void,
  initialValues: any,
) => {
  const [values, setValues] = useState<any>(initialValues);
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
