import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { SearchForm } from "../SearchForm/SearchForm";
import { useGetCitiesQuery, useGetSelectedFiltersMutation } from "../../store/api/searchData";
import { FiltersType, FiltersTypeEnum } from "../../types/FiltersType";
import { FILTER_CHANGE_DEBOUNCE_TIME, propertyTypes, SEARCH_DEBOUNCE_TIME } from "../../const";
import { filtersSliceActions } from "../../store/slices/filters";
import { useAppDispatch } from "../../store/hooks";
import debounce from "lodash/debounce";
import { Dropdown } from "primereact/dropdown";
import { onlyUnique } from "../../utils";
import { NotificationManager } from "../Notifications";

type Props = {
    selectedFilters: Partial<FiltersType> | null
};

export const SearchToolbar: React.FC<Props> = ({ selectedFilters }) => {
    const dispatch = useAppDispatch();
    const getCitiesQuery = useGetCitiesQuery();
    const cities = getCitiesQuery.data;
    const [searchString, setSearchString] = useState("");
    const [getSelectedFiltres] = useGetSelectedFiltersMutation();
    const [selectedFiltersInternal, setSelectedFiltersInternal] = useState<Partial<FiltersType> | null>(null)
    const overlayPanelRef: any = useRef(null);
    const [activeButton, setActiveButton] = useState<'buy' | 'rent'>("buy");
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
            console.error("Error::onSearchCLick", e);
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
    const startContent = (
        <div className="flex flex-row flex-wrap gap-2">
            <Button
                type="button"
                label="Най-популярни"
                onClick={() => { }}
                severity="help"
                outlined
                raised
                badge={"8"}
                badgeClassName="p-badge-info"
            />
        </div>
    );
    const onFiltersChange = useCallback((params: { key: keyof FiltersType; value: FiltersType[keyof FiltersType] }) => {
        setSelectedFiltersInternal((prev) => ({
            ...prev,
            [params.key]: params.value,
        }));
    }, []);

    const centerContent = (
        <div className="search-wrapper">
            <div className="buttons-wrapper">
                <button
                    className={activeButton === "buy" ? "active" : "unactive"}
                    onClick={() => setActiveButton("buy")}
                >
                    Buy
                </button>
                <button
                    className={activeButton === "rent" ? "active" : "unactive"}
                    onClick={() => setActiveButton("rent")}
                >
                    Rent
                </button>
            </div>
            <div className="filters-wrapper">
                <IconField style={{ margin: "auto", width: "95%" }}>
                    <InputIcon
                        className="pi pi-filter p-overlay-badge"
                        onClick={(e) => overlayPanelRef?.current?.toggle(e)}
                        style={{ cursor: "pointer", marginLeft: "12px" }}
                    >
                        {selectedFiltersInternal && (
                            <Badge
                                value={Object.keys(selectedFiltersInternal).length}
                                style={{
                                    fontSize: "0.5rem",
                                    minWidth: "15px",
                                    minHeight: "15px",
                                    height: "5px",
                                    lineHeight: "15px",
                                }}
                            ></Badge>
                        )}
                    </InputIcon>
                    <InputText
                        placeholder="Бързо търсене (напр. Двустаен апартамент в София)"
                        style={{
                            width: "100%",
                            display: "inline-block",
                            paddingLeft: "40px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                        }}
                        onChange={onSearchInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearchClick({ searchString });
                                debounceOnSearchClick.cancel();
                            }
                        }}
                    />
                    <InputIcon
                        className="pi pi-search"
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => onSearchClick({ searchString })}
                    />
                    <OverlayPanel ref={overlayPanelRef} closeOnEscape dismissable={true}>
                        <SearchForm
                            updatedFormValuesExternal={selectedFiltersInternal}
                            onFiltersChange={onFiltersChange}
                            cities={cities}
                        />
                    </OverlayPanel>
                </IconField>
                <div className="search-input-homepage-wrapper">
                    <Dropdown
                        style={{ width: "240px" }}
                        value={
                            selectedFilters && selectedFilters[FiltersTypeEnum.PropertyType]
                                ? selectedFilters[FiltersTypeEnum.PropertyType]
                                : propertyTypes[0]
                        }
                        name={FiltersTypeEnum.PropertyType}
                        onChange={(e) => {
                            onFiltersChange({ key: FiltersTypeEnum.PropertyType, value: e.value });
                        }}
                        options={propertyTypes}
                        placeholder="Избери тип на имота"
                        checkmark={true}
                        highlightOnSelect={false}
                    />
                    <Dropdown
                        style={{ width: "240px" }}
                        value={
                            selectedFilters && selectedFilters[FiltersTypeEnum.City]
                                ? selectedFilters[FiltersTypeEnum.City]
                                : "София"
                        }
                        name={FiltersTypeEnum.PropertyType}
                        onChange={(e) => {
                            onFiltersChange({ key: FiltersTypeEnum.City, value: e.value });
                        }}
                        options={cities?.map((city) => city.City).filter(onlyUnique)}
                        placeholder="гр. София"
                        checkmark={true}
                        highlightOnSelect={false}
                    />
                    <div className="price-input-container">
                        <div className="icon">€</div>
                        <input
                            type="text"
                            value={
                                selectedFilters && selectedFilters[FiltersTypeEnum.BudgetLowest]
                                    ? selectedFilters[FiltersTypeEnum.BudgetLowest]
                                    : ""
                            }
                            placeholder="100,000"
                            onChange={(e) => {
                                onFiltersChange({ key: FiltersTypeEnum.BudgetLowest, value: Number(e.target.value) });
                            }}
                        />
                        <div className="divider"></div>
                        <div className="icon">€</div>
                        <input
                            type="text"
                            value={
                                selectedFilters && selectedFilters[FiltersTypeEnum.BudgetHighest]
                                    ? selectedFilters[FiltersTypeEnum.BudgetHighest]
                                    : ""
                            }
                            placeholder="100,000"
                            onChange={(e) => {
                                onFiltersChange({ key: FiltersTypeEnum.BudgetHighest, value: Number(e.target.value) });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const endContent = <></>;

    return (
        <div className="card" style={{ position: "relative" }}>
            <Toolbar
                className="toolbar-homepage"
                // start={startContent}
                center={centerContent}
                // end={endContent}
                style={{
                    padding: "24px",
                    marginLeft: "18px",
                    marginRight: "18px",
                    marginTop: "42px",
                    marginBottom: "8px",
                }}
            />
        </div>
    );
};
