import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { HomePageSearchForm } from "../SearchForm/HomePageSearchForm";
import { useGetCitiesQuery, useGetSelectedFitlersMutation } from "../../store/api/searchData";
import { FiltersType, FiltersTypeEnum } from "../../types/FiltersType";
import { propertyTypes } from "../../const";
import { filtersSliceActions, filtersSliceSelectors } from "../../store/slices/filters";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import debounce from "lodash/debounce";
import { Dropdown } from "primereact/dropdown";
import { onlyUnique } from "../../utils";

type Props = {
    setIsLoading: (isLoading: boolean) => void;
};

export const SearchToolbar: React.FC<Props> = ({ setIsLoading }) => {
    const dispatch = useAppDispatch();
    const getCitiesQuery = useGetCitiesQuery();
    const cities = getCitiesQuery.data;
    const selectedFilters = useAppSelector(filtersSliceSelectors.selectedFilters);
    const [searchString, setSearchString] = useState("");
    const [getSelectedFiltres, { isLoading: isGetSelectedFiltersLoading, isError }] =
        useGetSelectedFitlersMutation();
    const [selectedFiltersExternal, setSelectedFiltersExternal] = useState<Partial<FiltersType> | null>(null)
    const overlayPanelRef: any = useRef(null);
    const [activeButton, setActiveButton] = useState<'buy' | 'rent'>("buy");

    useEffect(() => {
        setIsLoading && setIsLoading(isGetSelectedFiltersLoading);
    }, [isGetSelectedFiltersLoading, setIsLoading]);
    useEffect(() => {
        dispatch(filtersSliceActions.setSelectedFilters(selectedFiltersExternal));
    }, [selectedFiltersExternal]);

    const onSearchClick = async () => {
        try {
            const result = await getSelectedFiltres(searchString);
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
                    setSelectedFiltersExternal(newSelectedFilters);
                }
            } else {
                setSelectedFiltersExternal(null);
            }
        } catch (e: any) {
            console.error("Error::onSearchCLick", e);
        }
    };
    const onSearchInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setSearchString(e.target.value);
            const debouncedSearch = useRef(debounce(onSearchClick, 1000)).current;
            // TODO: fix this
            debouncedSearch();
        },
        [setSearchString, onSearchClick]
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
        dispatch(filtersSliceActions.setSelectedFilters({
            ...selectedFilters,
            [params.key]: params.value,
        }));
        setSelectedFiltersExternal((prev) => ({
            ...prev,
            [params.key]: params.value,
        }));
    }, [selectedFilters]);

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
                        {selectedFiltersExternal && (
                            <Badge
                                value={Object.keys(selectedFiltersExternal).length}
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
                    />
                    <InputIcon
                        className="pi pi-search"
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={onSearchClick}
                    />
                    <OverlayPanel ref={overlayPanelRef} closeOnEscape dismissable={true}>
                        <HomePageSearchForm updatedFormValuesExternal={selectedFiltersExternal} onFiltersChange={onFiltersChange} cities={cities} />
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
                        <input type="text" placeholder="100,000" />
                        <div className="divider"></div>
                        <div className="icon">€</div>
                        <input type="text" placeholder="100,000" />
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
