import { DropdownChangeEvent } from "primereact/dropdown";
import { ChangeEvent, useEffect, useState } from "react";

export const useForm = (
  submitHandler: (values: any) => void,
  initialValues: any,
  updatedFormValues: any
) => {
  const [values, setValues] = useState<any>(initialValues);

  useEffect(() => {
    if (updatedFormValues && values) {
      for (const value in updatedFormValues) {
        setValues({
          ...values,
          [value]: updatedFormValues[value]
        })
      }
    }
  }, [updatedFormValues, values])

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
