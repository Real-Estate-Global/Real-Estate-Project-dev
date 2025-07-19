import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useForm } from "../../hooks/useForm";
import { onlyUnique } from "../../utils";
import { useGetCitiesQuery } from "../../store/api/searchData";
import { InputNumberRangeSlider } from "./InputNumberRangeSlider";
import { FiltersType, FiltersTypeEnum } from "../../types/FiltersType";
import { propertyTypes } from "../../const";
import isEqual from "lodash/isEqual"

type Props = {
  updatedFormValuesExternal?: Partial<FiltersType> | null;
  onFiltersChange?: (params: { key: keyof FiltersType; value: FiltersType[keyof FiltersType] }) => void;
  cities?: { City: string; District?: string }[];
};

const defaultFormValues = {
  [FiltersTypeEnum.PropertyType]: propertyTypes[0],
  [FiltersTypeEnum.City]: "София",
  [FiltersTypeEnum.RoomsLowest]: 1,
  [FiltersTypeEnum.RoomsHighest]: 4,
  [FiltersTypeEnum.FloorLowest]: 1,
  [FiltersTypeEnum.FloorHighest]: 12,
  [FiltersTypeEnum.AreaLowest]: 20,
  [FiltersTypeEnum.AreaHighest]: 100,
  [FiltersTypeEnum.BudgetLowest]: 10000,
  [FiltersTypeEnum.BudgetHighest]: 100000,
};

export const SearchForm: React.FC<Props> = ({
  updatedFormValuesExternal,
  onFiltersChange,
  cities
}) => {
  const {
    values,
    onChange: onFormChange,
    setValues
  } = useForm(() => { }, defaultFormValues);

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
    [onFiltersChange]
  );

  useEffect(() => {
    const filteredValues = updatedFormValuesExternal
      ? Object.keys(updatedFormValuesExternal).reduce((acc, key) => {
        if (key in values) {
          acc[key as keyof FiltersType] = values[key as keyof FiltersType];
        }
        return acc;
      }, {} as Partial<FiltersType>)
      : {};

    if (updatedFormValuesExternal && !isEqual(updatedFormValuesExternal, filteredValues)) {
      setValues((currentValues: any) => ({
        ...currentValues,
        ...updatedFormValuesExternal
      }))
      return
    }
  }, [updatedFormValuesExternal, values])

  const uniqueCities = cities?.map((city) => city.City).filter(onlyUnique);
  // TODO: use reduce for performance improvement
  const uniqueDistricts = cities?.filter((city) => city.City === values[FiltersTypeEnum.City])
    .map((location) => location.District)
    .filter(onlyUnique)
    .filter(value => value !== undefined);

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
            options={uniqueCities}
            placeholder="Избери град"
            checkmark={true}
            highlightOnSelect={false}
          />
        </div>
        {
          // @ts-ignore ? removes undefined.
          uniqueDistricts?.length > 0 && (
            <div className="flex flex-column gap-1">
              <label htmlFor={FiltersTypeEnum.District}>Квартал:</label>
              <Dropdown
                value={values[FiltersTypeEnum.District]}
                name={FiltersTypeEnum.District}
                onChange={onChange}
                disabled={!values[FiltersTypeEnum.City]}
                options={uniqueDistricts}
                placeholder="Избери квартал"
                checkmark={true}
                highlightOnSelect={false}
              />
            </div>
          )
        }

        <div className="flex flex-column gap-1">
          <label>Стаи:</label>
          <InputNumberRangeSlider
            nameFrom={FiltersTypeEnum.RoomsLowest}
            initalValueFrom={updatedFormValuesExternal && updatedFormValuesExternal[FiltersTypeEnum.RoomsLowest]}
            nameTo={FiltersTypeEnum.RoomsHighest}
            initialValueTo={updatedFormValuesExternal && updatedFormValuesExternal[FiltersTypeEnum.RoomsHighest]}
            onChange={onChange}
            min={Math.min(1, values[FiltersTypeEnum.RoomsLowest])}
            max={Math.max(10, values[FiltersTypeEnum.RoomsHighest])}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label>Етаж:</label>
          <InputNumberRangeSlider
            nameFrom={FiltersTypeEnum.FloorLowest}
            initalValueFrom={updatedFormValuesExternal && updatedFormValuesExternal[FiltersTypeEnum.FloorLowest]}
            nameTo={FiltersTypeEnum.FloorHighest}
            initialValueTo={updatedFormValuesExternal && updatedFormValuesExternal[FiltersTypeEnum.FloorHighest]}
            onChange={onChange}
            min={Math.min(0, values[FiltersTypeEnum.FloorLowest])}
            max={Math.max(100, values[FiltersTypeEnum.FloorHighest])}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label>Площ кв.м:</label>
          <InputNumberRangeSlider
            nameFrom={FiltersTypeEnum.AreaLowest}
            initalValueFrom={updatedFormValuesExternal && updatedFormValuesExternal[FiltersTypeEnum.AreaLowest]}
            nameTo={FiltersTypeEnum.AreaHighest}
            initialValueTo={updatedFormValuesExternal && updatedFormValuesExternal[FiltersTypeEnum.AreaHighest]}
            onChange={onChange}
            min={Math.min(1, values[FiltersTypeEnum.AreaLowest])}
            max={Math.max(2000, values[FiltersTypeEnum.AreaHighest])}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label>Цена:</label>
          <InputNumberRangeSlider
            nameFrom={FiltersTypeEnum.BudgetLowest}
            initalValueFrom={updatedFormValuesExternal && updatedFormValuesExternal[FiltersTypeEnum.BudgetLowest]}
            nameTo={FiltersTypeEnum.BudgetHighest}
            initialValueTo={updatedFormValuesExternal && updatedFormValuesExternal[FiltersTypeEnum.BudgetHighest]}
            onChange={onChange}
            min={Math.min(0, values[FiltersTypeEnum.BudgetLowest])}
            max={Math.max(100000, values[FiltersTypeEnum.BudgetHighest])}
          />
        </div>
      </div>
    </div>
  );
};
