{/* <div className="searchFormDiv-wrapper">
      <div className="heading-titles">
        <h1>Discover your perfect home</h1>
        <h3>Discover the perfect home through our best search system</h3>
        <div>
          <button className="heading-button heading-search-button">Search</button>
          <button className="heading-button heading-why-us-button">Why us?</button>
        </div>
      </div> */}

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
import { SearchForm } from "../SearchForm/SearchForm";
import { useGetSelectedFitlersMutation } from "../../store/api/searchData";
import { FiltersType } from "../../types/FiltersType";

type Props = {};

export const HomeSearchNew: React.FC<Props> = () => {
    const [searchString, setSearchString] = useState("");
    const [selectedFilters, setSelectedFilters] =
        useState<Partial<FiltersType>>();
    const [getSelectedFiltres, { isLoading, isError }] =
        useGetSelectedFitlersMutation();
    const overlayPanelRef: any = useRef(null);

    useEffect(() => { }, [selectedFilters]);
    const onSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setSearchString(e.target.value);
        },
        [setSearchString]
    );
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
                    setSelectedFilters(newSelectedFilters);
                }
            } else {
                setSelectedFilters(undefined);
            }
        } catch (e: any) {
            console.log("Error::onSearchCLick", e);
        }
    };

    console.log("selectedFilters", selectedFilters);
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

    const centerContent = (
        <>
            <IconField>
                <InputIcon
                    className="pi pi-filter p-overlay-badge"
                    onClick={(e) => overlayPanelRef?.current?.toggle(e)}
                    style={{ cursor: "pointer", marginLeft: "12px" }}
                >
                    {selectedFilters && (
                        <Badge
                            value={Object.keys(selectedFilters).length}
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
                        width: "600px",
                        display: "inline-block",
                        paddingLeft: "40px",
                    }}
                    onChange={onSearchChange}
                />
                <InputIcon
                    className="pi pi-search"
                    style={{ cursor: "pointer", marginLeft: "12px" }}
                    onClick={onSearchClick}
                />
                <OverlayPanel ref={overlayPanelRef} closeOnEscape dismissable={true}>
                    <SearchForm updatedFormValues={selectedFilters} onSearch={() => { }} />
                </OverlayPanel>
            </IconField>
        </>
    );

    const endContent = <></>;

    return (
        <div className="searchFformDiv-wrapper">
            {/* <div className="searchFormDiv-wrapper"> */}
            <div className="heading-titles">
                <h1>Discover your perfect home</h1>
                <h3>Discover the perfect home through our best search system</h3>
                <div>
                    <button className="heading-button heading-search-button">Search</button>
                    <button className="heading-button heading-why-us-button">Why us?</button>
                </div>
            </div>
            <div className="card" style={{position: "relative", zIndex: "1"}}>
                <Toolbar
                    start={startContent}
                    center={centerContent}
                    end={endContent}
                    style={{
                        padding: "24px",
                        marginLeft: "18px",
                        marginRight: "18px",
                        marginTop: "42px",
                        marginBottom: "8px",
                    }}
                />
            </div>
        </div>
    );
};
