import { ChangeEvent, FormEventHandler, useState } from "react";

export default function useForm(submitHandler: (values: any) => void, initialValues: any) {
  const [values, setValues] = useState(initialValues);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any >) => {
    setValues((state: any) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const updateValues = (newValues: any) => {
    setValues(newValues);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    submitHandler(values);
  };

  return {
    values,
    onChange,
    updateValues,
    onSubmit,
  };
}
