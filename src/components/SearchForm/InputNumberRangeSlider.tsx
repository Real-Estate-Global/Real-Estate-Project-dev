import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { ChangeEvent, useCallback, useState } from "react";

type Props = {
  nameFrom: string;
  nameTo: string;
  initalValueFrom?: number | null;
  initialValueTo?: number | null;
  min: number;
  max: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const InputNumberRangeSlider: React.FC<Props> = ({
  nameFrom,
  nameTo,
  initalValueFrom,
  initialValueTo,
  onChange,
  min,
  max,
}) => {
  const [valueFrom, setValueFrom] = useState<number>(initalValueFrom || min);
  const [valueTo, setValueTo] = useState<number>(initialValueTo || max);
  // useEffect(() => {
  //   // initialValueTo !== undefined && setValueTo(initialValueTo);
  // }, [initialValueTo]);
  // useEffect(() => {
  //   // initalValueFrom !== undefined && setValueFrom(initalValueFrom);
  // }, [initalValueFrom]);
  const onInputChangeBuilder = (type: "from" | "to" | "range") =>
    useCallback(
      (e: InputNumberValueChangeEvent | SliderChangeEvent) => {
        if (type === "from") {
          const value = (e as InputNumberValueChangeEvent).value;
          if (value != null && value <= valueTo) {
            setValueFrom(value);
            onChange({ target: { name: nameFrom, value } } as any);
          }
        }
        if (type === "to") {
          const value = (e as InputNumberValueChangeEvent).value;
          if (value != null && value >= valueFrom) {
            setValueTo(value);
            onChange({ target: { name: nameTo, value } } as any);
          }
        }
        if (type === "range") {
          const value = (e as SliderChangeEvent).value as [number, number];
          if (value != null) {
            const [sliderValueFrom, sliderValueTo] = value;
            setValueFrom(sliderValueFrom);
            setValueTo(sliderValueTo);
            let debounceTimeout: NodeJS.Timeout | undefined;

            if (debounceTimeout) {
              clearTimeout(debounceTimeout);
            }

            debounceTimeout = setTimeout(() => {
              if (sliderValueFrom < valueTo) {
                onChange({
                  target: { name: nameFrom, value: sliderValueFrom },
                } as any);
              }
              if (sliderValueTo > valueFrom) {
                onChange({
                  target: { name: nameTo, value: sliderValueTo },
                } as any);
              }
            }, 50);
          }
        }
      },
      [valueFrom, valueTo, nameFrom, nameTo, setValueFrom, setValueTo, onChange]
    );
  return (
    <>
      <div className="flex flex-row gap-1 align-items-center">
        <div className="flex flex-row gap-1 align-items-center">
          <label htmlFor={"from"}>от:</label>
          <InputNumber
            name="from"
            value={valueFrom}
            onValueChange={onInputChangeBuilder("from")}
          />
        </div>
        <div className="flex flex-row gap-1 align-items-center">
          <label htmlFor={"to"}>до:</label>
          <InputNumber
            name="to"
            value={valueTo}
            onValueChange={onInputChangeBuilder("to")}
          />
        </div>
      </div>
      <div style={{ display: "flex", width: "100%", position: "relative", marginTop: "4px" }}>
        <Slider
          min={min}
          max={max}
          value={[valueFrom, valueTo]}
          onChange={onInputChangeBuilder("range")}
          range
          className="w-full"
        />
      </div>
    </>
  );
};
