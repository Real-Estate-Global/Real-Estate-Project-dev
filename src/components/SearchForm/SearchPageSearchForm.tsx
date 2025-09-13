import React from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumberRangeSlider } from "./InputNumberRangeSlider";
import { FiltersType, FiltersTypeEnum } from "../../types/FiltersType";
import { propertyTypes } from "../../const";
import { useSearchForm } from "./useSearchForm";

type Props = {
  updatedFormValuesExternal?: Partial<FiltersType> | null;
  onFiltersChange?: (params: { key: keyof FiltersType; value: FiltersType[keyof FiltersType] }) => void;
  cities?: { City: string; District?: string }[];
};

export const SearchPageSearchForm: React.FC<Props> = ({
  updatedFormValuesExternal,
  onFiltersChange,
  cities
}) => {
  const {
    values,
    onChange,
    uniqueCities,
    uniqueDistricts
  } = useSearchForm({
    updatedFormValuesExternal,
    onFiltersChange,
    cities,
  });

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
