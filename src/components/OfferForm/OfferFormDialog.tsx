import React, { ChangeEvent, useCallback, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useForm } from "../../hooks/useForm";
import { OfferFormDataEnum, OfferType } from "../../types/OfferType";
import { onlyUnique } from "../../utils";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { useGetCitiesQuery } from "../../store/api/searchData";
import { UploadMultipleImageForm } from "../UploadImage/UploadMultipleImageForm";
import { ImageFileType, WatermarkType } from "../../types/ImageFileType";
import { propertyTypes } from "../../const";
import { useAppSelector } from "../../store/hooks";
import { profileSliceSelectors } from "../../store/slices/profileSlice";

type Props = {
  show: boolean;
  initialFormValues?: OfferType | null;
  onClose: () => void;
  onSubmit: (values: OfferType) => Promise<void>;
};

const defaultFormValues = {
  [OfferFormDataEnum.PropertyType]: propertyTypes[0],
  [OfferFormDataEnum.Location]: "София",
  [OfferFormDataEnum.Currency]: "€",
};

export const OfferFormDialog: React.FC<Props> = ({
  show,
  initialFormValues,
  onClose,
  onSubmit,
}) => {
  const getCitiesQuery = useGetCitiesQuery();
  const cities = getCitiesQuery.data;
  const watermark = useAppSelector(profileSliceSelectors.watermark)

  const {
    values,
    onChange: onFormChange,
    onSubmit: onFormSubmit,
    setValues,
  } = useForm(onSubmit, {
    ...defaultFormValues,
    ...initialFormValues
  });
  const [touched, setTouched] = useState<Map<keyof OfferType, boolean>>(
    new Map([
      [OfferFormDataEnum.PropertyType, false],
      [OfferFormDataEnum.Location, false],
      [OfferFormDataEnum.District, false],
      [OfferFormDataEnum.Rooms, false],
      [OfferFormDataEnum.Floor, false],
      [OfferFormDataEnum.Price, false],
      [OfferFormDataEnum.Currency, false],
      [OfferFormDataEnum.Area, false],
      [OfferFormDataEnum.YearOfBuilding, false],
      [OfferFormDataEnum.Description, false],
      [OfferFormDataEnum.Images, false],
    ])
  );

  const getisInvalid = useCallback(
    (field: keyof OfferType) => {
      return (
        values[field] === undefined ||
        values[field] === "" ||
        values[field] === null
      );
    },
    [values]
  );

  const getHasFormError = useCallback(
    (field: keyof OfferType) => {
      return touched.get(field) && getisInvalid(field);
    },
    [touched, getisInvalid]
  );

  const onDialogClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setValues(initialFormValues || defaultFormValues);
    }, 400);
  }, [onClose, setValues, initialFormValues]);

  const onSubmitButtonClick = useCallback(() => {
    // TODO: other validation?
    if (
      Object.keys(values).some((key) => {
        return getisInvalid(key as keyof OfferType);
      })
    ) {
      setTouched(
        new Map([
          [OfferFormDataEnum.PropertyType, true],
          [OfferFormDataEnum.Location, true],
          [OfferFormDataEnum.District, true],
          [OfferFormDataEnum.Rooms, true],
          [OfferFormDataEnum.Floor, true],
          [OfferFormDataEnum.Price, true],
          [OfferFormDataEnum.Currency, true],
          [OfferFormDataEnum.Area, true],
          [OfferFormDataEnum.YearOfBuilding, true],
          [OfferFormDataEnum.Description, true],
        ])
      );
    } else {
      onFormSubmit();
    }
  }, [touched, values, onFormSubmit, setTouched]);
  const onChange = useCallback(
    (
      e:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | DropdownChangeEvent
    ) => {
      if (e.target.value !== null) {
        setTouched(
          new Map(touched.set(e.target.name as keyof OfferType, true))
        );
      }

      onFormChange(e);
    },
    [touched, setTouched, onFormChange]
  );
  const onUploadImages = useCallback(
    (images: ImageFileType[]) => {
      onChange({
        target: { value: images, name: OfferFormDataEnum.Images },
      } as any);
    },
    [])

  const footerContent = (
    <div>
      <Button
        label="Submit"
        icon="pi pi-check"
        onClick={onSubmitButtonClick}
        autoFocus
      />
    </div>
  );

  
  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Добави обява"
        visible={show}
        style={{ width: "520px" }}
        onHide={onDialogClose}
        footer={footerContent}
      >
        <div className="flex flex-column gap-2">
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.PropertyType}>
              Тип на имота:
            </label>
            <Dropdown
              value={values[OfferFormDataEnum.PropertyType]}
              name={OfferFormDataEnum.PropertyType}
              onChange={onChange}
              options={propertyTypes}
              placeholder="Избери тип на имота"
              checkmark={true}
              highlightOnSelect={false}
              invalid={getHasFormError(OfferFormDataEnum.PropertyType)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.Location}>Град:</label>
            <Dropdown
              value={values[OfferFormDataEnum.Location]}
              name={OfferFormDataEnum.Location}
              onChange={onChange}
              options={cities?.map((city) => city.City).filter(onlyUnique)}
              placeholder="Избери град"
              checkmark={true}
              highlightOnSelect={false}
              invalid={getHasFormError(OfferFormDataEnum.Location)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.District}>Квартал:</label>
            <Dropdown
              value={values[OfferFormDataEnum.District]}
              name={OfferFormDataEnum.District}
              onChange={onChange}
              disabled={!values[OfferFormDataEnum.Location]}
              options={cities
                ?.filter(
                  (city) => city.City === values[OfferFormDataEnum.Location]
                )
                .map((location) => location.District)}
              placeholder="Избери квартал"
              checkmark={true}
              highlightOnSelect={false}
              invalid={getHasFormError(OfferFormDataEnum.District)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.Rooms}>Стаи:</label>
            <InputNumber
              name={OfferFormDataEnum.Rooms}
              value={values[OfferFormDataEnum.Rooms]}
              onValueChange={onChange}
              mode="decimal"
              showButtons
              placeholder="Избери брои стаи"
              min={1}
              max={10}
              invalid={getHasFormError(OfferFormDataEnum.Rooms)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.Floor}>Етаж:</label>
            <InputNumber
              name={OfferFormDataEnum.Floor}
              value={values[OfferFormDataEnum.Floor]}
              onValueChange={onChange}
              mode="decimal"
              showButtons
              placeholder="Избери етаж"
              min={-3}
              max={200}
              invalid={getHasFormError(OfferFormDataEnum.Floor)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.Price}>Цена:</label>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">€</span>
              <InputNumber
                name={OfferFormDataEnum.Price}
                value={values[OfferFormDataEnum.Price]}
                onValueChange={onChange}
                mode="decimal"
                showButtons
                min={0}
                invalid={getHasFormError(OfferFormDataEnum.Price)}
              />
            </div>
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.Area}>Площ:</label>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">кв.м</span>
              <InputNumber
                required
                name={OfferFormDataEnum.Area}
                value={values[OfferFormDataEnum.Area]}
                onValueChange={onChange}
                mode="decimal"
                showButtons
                min={1}
                invalid={getHasFormError(OfferFormDataEnum.Area)}
              />
            </div>
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.YearOfBuilding}>
              Година на строителство:
            </label>
            <Calendar
              dateFormat="yy"
              view="year"
              showIcon
              placeholder="Избери година на строителство"
              name={OfferFormDataEnum.YearOfBuilding}
              value={values[OfferFormDataEnum.YearOfBuilding]}
              showButtonBar
              onChange={onChange}
              invalid={getHasFormError(OfferFormDataEnum.YearOfBuilding)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.Description}>Описание:</label>
            <InputTextarea
              name={OfferFormDataEnum.Description}
              value={values[OfferFormDataEnum.Description]}
              autoResize
              onChange={onChange}
              required
              invalid={getHasFormError(OfferFormDataEnum.Description)}
            />
          </div>
          <div className="flex flex-column gap-1">
            <label htmlFor={OfferFormDataEnum.Description}>Снимки:</label>
            <UploadMultipleImageForm watermark={watermark} initialImages={values[OfferFormDataEnum.Images]} onUpload={onUploadImages} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
