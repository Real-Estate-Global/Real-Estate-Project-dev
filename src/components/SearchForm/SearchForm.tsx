import React, { ChangeEvent, useCallback, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useForm } from "../../hooks/useForm";
import { onlyUnique } from "../../utils";
import { useGetCitiesQuery } from "../../store/api/searchData";
import { InputNumberRangeSlider } from "./InputNumberRangeSlider";
import { FiltersType, FiltersTypeEnum } from "../../types/FiltersType";
import { propertyTypes } from "../../const";

type Props = {
  updatedFormValues?: Partial<FiltersType>;
  onSearch: (values: FiltersType) => void;
};

const defaultFormValues = {
  [FiltersTypeEnum.PropertyType]: propertyTypes[0],
  [FiltersTypeEnum.City]: "София",
  [FiltersTypeEnum.RoomsLowest]: 1,
  [FiltersTypeEnum.RoomsHighest]: 4,
  [FiltersTypeEnum.AreatLowest]: 20,
  [FiltersTypeEnum.AreatHighest]: 100,
};

export const SearchForm: React.FC<Props> = ({
  updatedFormValues,
  onSearch,
}) => {
  const getCitiesQuery = useGetCitiesQuery();
  const cities = getCitiesQuery.data;
  console.log('updatedFormValues 1', updatedFormValues);
  const {
    values,
    onChange: onFormChange,
    onSubmit: onFormSubmit,
    setValues,
  } = useForm(onSearch, defaultFormValues, updatedFormValues);
  console.log("values", values);
  const [touched, setTouched] = useState<Map<keyof FiltersType, boolean>>(
    new Map([
      [FiltersTypeEnum.PropertyType, false],
      [FiltersTypeEnum.City, false],
      [FiltersTypeEnum.District, false],
      [FiltersTypeEnum.BudgetLowest, false],
      [FiltersTypeEnum.BudgetHighest, false],
      [FiltersTypeEnum.AreatLowest, false],
      [FiltersTypeEnum.AreatHighest, false],
      [FiltersTypeEnum.FloorLowest, false],
      [FiltersTypeEnum.FloorHighest, false],
      [FiltersTypeEnum.RoomsLowest, false],
      [FiltersTypeEnum.RoomsHighest, false],
    ])
  );

  const getisInvalid = useCallback(
    (field: keyof FiltersType) => {
      return (
        values[field] === undefined ||
        values[field] === "" ||
        values[field] === null
      );
    },
    [values]
  );

  const getHasFormError = useCallback(
    (field: keyof FiltersType) => {
      return touched.get(field) && getisInvalid(field);
    },
    [touched, getisInvalid]
  );

  const onSubmitButtonClick = useCallback(() => {
    // TODO: other validation?
    if (
      Object.keys(values).some((key) => {
        return getisInvalid(key as keyof FiltersType);
      })
    ) {
      setTouched(
        new Map([
          [FiltersTypeEnum.PropertyType, true],
          [FiltersTypeEnum.City, true],
          [FiltersTypeEnum.District, true],
          [FiltersTypeEnum.BudgetLowest, true],
          [FiltersTypeEnum.BudgetHighest, true],
          [FiltersTypeEnum.AreatLowest, true],
          [FiltersTypeEnum.AreatHighest, true],
          [FiltersTypeEnum.FloorLowest, true],
          [FiltersTypeEnum.FloorHighest, true],
          [FiltersTypeEnum.RoomsLowest, true],
          [FiltersTypeEnum.RoomsHighest, true],
        ])
      );
    } else {
      onFormSubmit();
    }
  }, [touched, values, onFormSubmit, setTouched]);
  const onChange = useCallback(
    (
      e:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | DropdownChangeEvent
    ) => {
      // @ts-ignore
      if (e.target && e.target.value !== null) {
        setTouched(
          new Map(touched.set(e.target.name as keyof FiltersType, true))
        );
      }

      onFormChange(e);
    },
    [touched, setTouched, onFormChange]
  );

  const footerContent = (
    <div>
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={onSubmitButtonClick}
        autoFocus
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <div className="flex flex-column gap-2">
        <div className="flex flex-column gap-1">
          <label htmlFor={FiltersTypeEnum.PropertyType}>Тип на имота:</label>
          <Dropdown
            value={values[FiltersTypeEnum.PropertyType]}
            name={FiltersTypeEnum.PropertyType}
            onChange={onChange}
            options={propertyTypes}
            placeholder="Избери тип на имота"
            checkmark={true}
            highlightOnSelect={false}
            invalid={getHasFormError(FiltersTypeEnum.PropertyType)}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label htmlFor={FiltersTypeEnum.City}>Град:</label>
          <Dropdown
            value={values[FiltersTypeEnum.City]}
            name={FiltersTypeEnum.City}
            onChange={onChange}
            options={cities?.map((city) => city.City).filter(onlyUnique)}
            placeholder="Избери град"
            checkmark={true}
            highlightOnSelect={false}
            invalid={getHasFormError(FiltersTypeEnum.City)}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label htmlFor={FiltersTypeEnum.District}>Квартал:</label>
          <Dropdown
            value={values[FiltersTypeEnum.District]}
            name={FiltersTypeEnum.District}
            onChange={onChange}
            disabled={!values[FiltersTypeEnum.City]}
            options={cities
              ?.filter((city) => city.City === values[FiltersTypeEnum.City])
              .map((location) => location.District)}
            placeholder="Избери квартал"
            checkmark={true}
            highlightOnSelect={false}
            invalid={getHasFormError(FiltersTypeEnum.District)}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label>Стаи:</label>
          <InputNumberRangeSlider
            nameFrom={FiltersTypeEnum.RoomsLowest}
            initalValueFrom={values[FiltersTypeEnum.RoomsLowest]}
            nameTo={FiltersTypeEnum.RoomsHighest}
            initialValueTo={values[FiltersTypeEnum.RoomsHighest]}
            onChange={onChange}
            min={1}
            max={10}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label>Площ кв.м:</label>
          <InputNumberRangeSlider
            nameFrom={FiltersTypeEnum.AreatLowest}
            initalValueFrom={values[FiltersTypeEnum.AreatLowest]}
            nameTo={FiltersTypeEnum.AreatHighest}
            initialValueTo={values[FiltersTypeEnum.AreatHighest]}
            onChange={onChange}
            min={1}
            max={2000}
          />
        </div>
      </div>
    </div>
  );
};
