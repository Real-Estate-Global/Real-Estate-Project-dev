import { ChangeEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FILTER_CHANGE_DEBOUNCE_TIME, SEARCH_DEBOUNCE_TIME } from "../../const";
import { NotificationManager } from "../Notifications";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { filtersSliceActions, filtersSliceSelectors } from "../../store/slices/filters";
import { useGetSelectedFiltersMutation } from "../../store/api/searchData";
import { FiltersType } from "../../types/FiltersType";

export const useSearchToolbar = () => {
    const dispatch = useAppDispatch();
    const selectedFilters = useAppSelector(filtersSliceSelectors.selectedFilters);
    const [searchString, setSearchString] = useState("");
    const [getSelectedFiltres] = useGetSelectedFiltersMutation();
    const [selectedFiltersInternal, setSelectedFiltersInternal] = useState<Partial<FiltersType> | null>(null)
    const controllerRef = useRef<AbortController | null>(null);

    const debouncedSetSelectedFilters = useMemo(
        () =>
            debounce((filters: Partial<FiltersType> | null) => {
                dispatch(filtersSliceActions.setSelectedFilters(filters));
            }, FILTER_CHANGE_DEBOUNCE_TIME),
        [dispatch]
    );

    useEffect(() => {
        debouncedSetSelectedFilters(selectedFiltersInternal ?? null);
        return () => {
            debouncedSetSelectedFilters.cancel();
        };
    }, [selectedFiltersInternal, debouncedSetSelectedFilters]);

    const onSearchClick = useCallback(async (params: { searchString: string }) => {
        try {
            const result = await getSelectedFiltres({ searchString: params.searchString });
            const data = result.data;
            if (data) {
                const filterKeys = Object.keys(data) as Array<keyof typeof data>;

                const newSelectedFilters =
                    filterKeys.reduce<Partial<FiltersType> | null>((acc, key) => {
                        if (data[key]) {
                            if (acc !== null) {
                                return {
                                    ...acc,
                                    [key]: data[key],
                                };
                            }

                            return {
                                [key]: data[key],
                            };
                        }

                        return acc;
                    }, null);

                if (newSelectedFilters) {
                    setSelectedFiltersInternal(newSelectedFilters);
                }
            } else {
                setSelectedFiltersInternal(null);
            }
        } catch (e: any) {
            console.error("Error::onSearchClick", e);
            NotificationManager.showError({
                message: "Грешка при търсене. Моля, опитайте отново.",
            });
        }
    }, []);
    const debounceOnSearchClick = useMemo(() => {
        return debounce(async (params: { searchString: string }) => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            const c = new AbortController();
            controllerRef.current = c;

            try {
                const result = await getSelectedFiltres({ searchString: params.searchString, signal: c.signal });
                const data = result.data;
                if (data) {
                    const filterKeys = Object.keys(data) as Array<keyof typeof data>;

                    const newSelectedFilters =
                        filterKeys.reduce<Partial<FiltersType> | null>((acc, key) => {
                            if (data[key]) {
                                if (acc !== null) {
                                    return {
                                        ...acc,
                                        [key]: data[key],
                                    };
                                }

                                return {
                                    [key]: data[key],
                                };
                            }

                            return acc;
                        }, null);

                    if (newSelectedFilters) {
                        setSelectedFiltersInternal(newSelectedFilters);
                    }
                } else {
                    setSelectedFiltersInternal(null);
                }
            } catch (e: any) {
                console.error("Error::onSearchCLick", e);
                NotificationManager.showError({
                    message: "Грешка при търсене. Моля, опитайте отново.",
                });
            } finally {
                if (controllerRef.current === c) {
                    controllerRef.current = null;
                }
            }
        }, SEARCH_DEBOUNCE_TIME);
    }, [controllerRef.current]);

    const onSearchInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setSearchString(e.target.value);

            debounceOnSearchClick({ searchString: e.target.value });
        },
        [debounceOnSearchClick]
    );

    const onFiltersChange = useCallback((params: { key: keyof FiltersType; value: FiltersType[keyof FiltersType] }) => {
        setSelectedFiltersInternal((prev) => ({
            ...prev,
            [params.key]: params.value,
        }));
    }, []);

    const handleSearch = useCallback(() => {
        onSearchClick({ searchString });
        debounceOnSearchClick.cancel();
    }, [searchString]);

    return {
        selectedFiltersInternal,
        onSearchInputChange,
        handleSearch,
        onFiltersChange,
    }
}