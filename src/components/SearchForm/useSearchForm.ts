import { ChangeEvent, useCallback, useEffect } from "react";
import { DropdownChangeEvent } from "primereact/dropdown";
import { useForm } from "../../hooks/useForm";
import { onlyUnique } from "../../utils";
import { FiltersType, FiltersTypeEnum } from "../../types/FiltersType";
import { propertyTypes } from "../../const";
import isEqual from "lodash/isEqual"

type Params = {
    updatedFormValuesExternal?: Partial<FiltersType> | null;
    onFiltersChange?: (params: { key: keyof FiltersType; value: FiltersType[keyof FiltersType] }) => void;
    cities?: { City: string; District?: string }[];
};

const defaultFormValues = {
    [FiltersTypeEnum.PropertyType]: propertyTypes[0],
    [FiltersTypeEnum.City]: "София",
    [FiltersTypeEnum.FloorLowest]: 1,
    [FiltersTypeEnum.FloorHighest]: 12,
    [FiltersTypeEnum.AreaLowest]: 20,
    [FiltersTypeEnum.AreaHighest]: 100,
    [FiltersTypeEnum.BudgetLowest]: 10000,
    [FiltersTypeEnum.BudgetHighest]: 100000,
};

export const useSearchForm = ({
    updatedFormValuesExternal,
    onFiltersChange,
    cities
}: Params) => {
    const {
        values,
        onChange: onFormChange,
        setValues
    } = useForm(() => { }, defaultFormValues);
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
    const uniqueCities = cities?.map((city) => city.City).filter(onlyUnique);
    // TODO: use reduce for performance improvement
    const uniqueDistricts = cities?.filter((city) => city.City === values[FiltersTypeEnum.City])
        .map((location) => location.District)
        .filter(onlyUnique)
        .filter(value => value !== undefined);

    return {
        uniqueCities,
        uniqueDistricts,
        values,
        onChange
    }
};
