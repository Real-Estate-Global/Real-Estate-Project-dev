import { DropdownChangeEvent } from "primereact/dropdown";
import { ChangeEvent, useEffect, useState } from "react";

export const useForm = (
  submitHandler: (values: any) => void,
  initialValues: any,
  updatedFormValues: any
) => {
  console.log('initialValues', initialValues)
  const [values, setValues] = useState<any>(initialValues);

  console.log('values', values)
  useEffect(() => {
    if (updatedFormValues && values) {
      for (const value in updatedFormValues) {
        setValues({
          ...values,
          [value]: updatedFormValues[value]
        })
      }
    }
  }, [updatedFormValues])

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
