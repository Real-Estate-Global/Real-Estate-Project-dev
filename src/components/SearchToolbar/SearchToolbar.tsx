import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useMemo, useRef, useState, } from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { SearchForm } from "../SearchForm/SearchForm";
import { useGetCitiesQuery } from "../../store/api/searchData";
import { FiltersTypeEnum } from "../../types/FiltersType";
import { propertyTypes } from "../../const";
import { Dropdown } from "primereact/dropdown";
import { onlyUnique } from "../../utils";
import { useSearchToolbar } from "./useSearchToolbar";


export const SearchToolbar: React.FC = () => {
    const getCitiesQuery = useGetCitiesQuery();
    const cities = getCitiesQuery.data;
    const overlayPanelRef: any = useRef(null);
    const [activeButton, setActiveButton] = useState<'buy' | 'rent'>("buy");
    const {
        selectedFiltersInternal,
        onSearchInputChange,
        handleSearch,
        onFiltersChange,
    } = useSearchToolbar();

    const startContent = useMemo(() => (
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
    ), []);

    const centerContent = useMemo(() => (
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
                                handleSearch();
                            }
                        }}
                    />
                    <InputIcon
                        className="pi pi-search"
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={handleSearch}
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
                            selectedFiltersInternal && selectedFiltersInternal[FiltersTypeEnum.PropertyType]
                                ? selectedFiltersInternal[FiltersTypeEnum.PropertyType]
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
                            selectedFiltersInternal && selectedFiltersInternal[FiltersTypeEnum.City]
                                ? selectedFiltersInternal[FiltersTypeEnum.City]
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
                                selectedFiltersInternal && selectedFiltersInternal[FiltersTypeEnum.BudgetLowest]
                                    ? selectedFiltersInternal[FiltersTypeEnum.BudgetLowest]
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
                                selectedFiltersInternal && selectedFiltersInternal[FiltersTypeEnum.BudgetHighest]
                                    ? selectedFiltersInternal[FiltersTypeEnum.BudgetHighest]
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
    ), [onFiltersChange, onSearchInputChange, handleSearch, selectedFiltersInternal, cities, activeButton]);

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
