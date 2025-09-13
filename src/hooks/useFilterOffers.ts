import { OfferType } from "../types/OfferType";
import { useAppSelector } from "../store/hooks";
import { filtersSliceSelectors } from "../store/slices/filters";
import { FiltersTypeEnum } from "../types/FiltersType";

export const useFilterOffers = (offers: OfferType[]) => {
    const selectedFilters = useAppSelector(filtersSliceSelectors.selectedFilters);
    const filteredOffers = selectedFilters
        ? offers.filter((offer) => {
            if (selectedFilters[FiltersTypeEnum.PropertyType]) {
                if (offer.propertyType !== selectedFilters[FiltersTypeEnum.PropertyType]) {
                    return false;
                }
            }
            if (selectedFilters[FiltersTypeEnum.City]) {
                if (offer.location !== selectedFilters[FiltersTypeEnum.City]) {
                    return false;
                }
            }
            if (selectedFilters[FiltersTypeEnum.District]) {
                if (offer.district !== selectedFilters[FiltersTypeEnum.District]) {
                    return false;
                }
            }
            if (selectedFilters[FiltersTypeEnum.BudgetLowest]) {
                if (offer.price < selectedFilters[FiltersTypeEnum.BudgetLowest]) {
                    return false;
                }
            }
            if (selectedFilters[FiltersTypeEnum.BudgetHighest]) {
                if (offer.price > selectedFilters[FiltersTypeEnum.BudgetHighest]) {
                    return false;
                }
            }
            if (selectedFilters[FiltersTypeEnum.AreaLowest]) {
                if (offer.area < selectedFilters[FiltersTypeEnum.AreaLowest]) {
                    return false;
                }
            }
            if (selectedFilters[FiltersTypeEnum.AreaHighest]) {
                if (offer.area > selectedFilters[FiltersTypeEnum.AreaHighest]) {
                    return false;
                }
            }
            if (selectedFilters[FiltersTypeEnum.FloorLowest]) {
                if (offer.floor < selectedFilters[FiltersTypeEnum.FloorLowest]) {
                    return false;
                }
            }
            if (selectedFilters[FiltersTypeEnum.FloorHighest]) {
                if (offer.floor > selectedFilters[FiltersTypeEnum.FloorHighest]) {
                    return false;
                }
            }
            // TODO: Implement year of building filter

            return true
        })
        : offers;

    return {
        selectedFilters,
        filteredOffers,
    };
};
