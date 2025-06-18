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
  updatedFormValues?: Partial<FiltersType> | null;
  onFiltersChange?: (params: { key: keyof FiltersType; value: FiltersType[keyof FiltersType] }) => void;
};

const defaultFormValues = {
  [FiltersTypeEnum.PropertyType]: propertyTypes[0],
  [FiltersTypeEnum.City]: "София",
  [FiltersTypeEnum.RoomsLowest]: 1,
  [FiltersTypeEnum.RoomsHighest]: 4,
  [FiltersTypeEnum.FloorLowest]: 1,
  [FiltersTypeEnum.FloorHighest]: 12,
  [FiltersTypeEnum.AreatLowest]: 20,
  [FiltersTypeEnum.AreatHighest]: 100,
};

export const SearchForm: React.FC<Props> = ({
  updatedFormValues,
  onFiltersChange,
}) => {
  const getCitiesQuery = useGetCitiesQuery();
  const cities = getCitiesQuery.data;
  const {
    values,
    onChange: onFormChange,
  } = useForm(() => { }, defaultFormValues, updatedFormValues);

  const onChange = useCallback(
    (
      e:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | DropdownChangeEvent
    ) => {

      onFormChange(e);
      if (e.target && e.target.value !== null) {
        onFiltersChange && onFiltersChange({
          key: e.target.name as keyof FiltersType,
          value: e.target.value as FiltersType[keyof FiltersType]
        });
      }
    },
    []
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
          <label>Етаж:</label>
          <InputNumberRangeSlider
            nameFrom={FiltersTypeEnum.FloorLowest}
            initalValueFrom={values[FiltersTypeEnum.FloorLowest]}
            nameTo={FiltersTypeEnum.FloorHighest}
            initialValueTo={values[FiltersTypeEnum.FloorHighest]}
            onChange={onChange}
            min={1}
            max={100}
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
