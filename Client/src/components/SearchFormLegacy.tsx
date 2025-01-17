import { useCallback, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import locations from "../locations";
import { onlyUnique } from "../utils";
import { FiltersType } from "../types/FiltersType";

type Props = {
  getHomeOfferList: (values: FiltersType) => void;
};

export const SearchFormLegacy: React.FC<Props> = ({ getHomeOfferList }) => {
  const [values, setValues] = useState<FiltersType>({
    city: "",
    type: "",
    district: "",
    budgetLowest: 0,
    budgetHighest: 0,
  });

  const onChange = useCallback((e: any) => {
    setValues((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  }, []);
  const onSearch = useCallback(() => {
    getHomeOfferList(values);
  }, [values]);

  return (
    <Card className={"searchFormDiv"}>
      <h4 id="search-form-title">Започни търсенето</h4>
      <form className="search-form" action="url">
        <label htmlFor="offer-type"></label>
        <select id="offer-type" name="offer-type" onChange={onChange}>
          <option value="offer-type" selected hidden>
            Тип обява
          </option>
          <option value="sell">Продава</option>
          <option value="rent">Дава под наем</option>
        </select>

        <label htmlFor="city"></label>
        <select id="city" name="city" required onChange={onChange}>
          <option value={undefined} selected hidden>
            Град
          </option>
          {locations
            .map((location) => location.City)
            .filter(onlyUnique)
            .map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>

        <label htmlFor="district"></label>
        <select
          id="district"
          name="district"
          disabled={!values.city}
          onChange={onChange}
        >
          <option value={undefined} selected hidden>
            Квартал
          </option>
          {locations
            .filter((location) => location.City === values.city)
            .map((location) => location.District)
            .map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
        </select>

        <label htmlFor="type"></label>
        <select id="type" name="type" onChange={onChange}>
          <option value="Type" selected hidden>
            Вид имот
          </option>
          <option value="Apartment">Апартамент</option>
          <option value="House">Къща</option>
          <option value="plot">Парцел</option>
        </select>

        <label htmlFor="budget-lowest"></label>
        <input
          name="budgetLowest"
          onChange={onChange}
          style={{ minWidth: "120px" }}
          type="number"
          id="budget-lowest"
          placeholder="Бюджет от"
        />

        <label htmlFor="budget-highest"></label>
        <input
          name="budgetHighest"
          onChange={onChange}
          style={{ minWidth: "120px" }}
          type="number"
          id="budget-highest"
          placeholder="Бюджет до"
        />
      </form>

      <Button outlined className="search-btn-form" onClick={onSearch}>
        Търсене
      </Button>
    </Card>
  );
};
