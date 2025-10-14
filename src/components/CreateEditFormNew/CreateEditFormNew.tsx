import { Checkbox } from "primereact/checkbox"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import React, { useEffect, useMemo, useState } from "react"
import { OfferType } from "../../types/OfferType"
import { Calendar } from "primereact/calendar"
import { Divider } from "primereact/divider"
import { InputTextarea } from "primereact/inputtextarea"
import { MultiSelect } from "primereact/multiselect"
import { Tag } from "primereact/tag"
import { Button } from "primereact/button"

type Props = { offerData?: OfferType }

interface Listing {
    id: string;
    title: string;
    priceEUR: number;
    address: string;
    city: string;
    district: string;
    areaM2: number;
    rooms: number;
    baths: number;
    floorNumber?: number;
    totalFloors?: number;
    year?: number;
    type: string;
    images: string[];
    tags?: string[];
    exclusive?: boolean;
    isNew?: boolean;
    description: string;
    features: string[];
}


const featureOptions = [
    { label: "Асансьор", value: "Асансьор", icon: "pi pi-angle-double-up" },
    { label: "Паркинг", value: "Паркинг", icon: "pi pi-car" },
    { label: "Контролиран достъп", value: "Контролиран достъп", icon: "pi pi-shield" },
    { label: "Склад", value: "Склад", icon: "pi pi-box" },
    { label: "ТЕЦ", value: "ТЕЦ", icon: "pi pi-bolt" },
    { label: "Климатизация", value: "Климатизация", icon: "pi pi-snowflake" },
];


export const CreateEditFormNew: React.FC<Props> = ({ offerData }) => {

    const [form, setForm] = useState<Partial<OfferType>>({
        // title: "",
        // // transaction: null,
        // propertyType: "",
        // location: "",
        // district: "",
        // address: "",
        // price: null,
        // area: null,
        // rooms: null,
        // baths: null,
        // floor: null,
        // totalFloors: null,
        // yearOfBuilding: "",
        // heating: null,
        // features: [],
        // tags: [],
        // description: ""
        // OfferType
    });

    // if (offerData) {
    //     setForm(offerData)
    // }
    useEffect(() => {
        if (offerData) {
            setForm(offerData); // edit: пълним с данните
        } else {
            setForm({});        // create: празно
        }
    }, [offerData?._id]); // или [offerData]

    // function set<K extends keyof OfferType>(key: K, value: OfferType[K]) {
    //     if (key === "yearOfBuilding") {
    //         setForm((prev: OfferType) => ({ ...prev, [key]: value?.toString }));

    //     } else {
    //         setForm((prev: OfferType) => ({ ...prev, [key]: value }));
    //     }
    // }
    const setField = <K extends keyof OfferType>(
        key: K,
        value: OfferType[K] | undefined
    ) => {
        if (key === "yearOfBuilding" && offerData) {
            setForm(prev => ({ ...prev, [key]: value }));
            // new Date(offerData.yearOfBuilding).getFullYear()
        } else {
            setForm(prev => ({ ...prev, [key]: value }));
        }
    }


    const pricePerM2 = useMemo(() => {
        const v = (form.price || 0) / (form.area || 0);
        return isFinite(v) && v > 0 ? Math.round(v) : 0;
    }, [form.price, form.area]);


    console.log("price log", pricePerM2)

    const validate = () => {
        const errs = [];
        if (!form.title?.trim()) errs.push("Въведи заглавие");
        // if (!form.transaction) errs.push("Избери тип на сделката");
        if (!form.propertyType) errs.push("Избери тип имот");
        if (!form.price || form.price <= 0) errs.push("Въведи цена");
        if (!form.area || form.area <= 0) errs.push("Въведи площ");
        if (!form.district?.trim()) errs.push("Въведи квартал");
        // if (images.length === 0) errs.push("Качи поне 1 снимка");
        return errs;
    };

    const publish = () => {
        const errs = validate();
        if (errs.length) {
            //   toastRef.current?.show({ severity: "warn", summary: "Провери полетата", detail: errs.join(" • "), life: 2500 });
            return;
        }
        // console.log("PUBLISH", { ...form, images });
        // toastRef.current?.show({ severity: "success", summary: "Обявата е създадена", life: 2000 });
    };

    const typeOptions = ["Апартамент", "Къща", "Мезонет", "Ателие"].map(t => ({ label: t, value: t }));

    return (
        <section className="main" style={{ marginTop: 16 }}>
            <article className="card pad content" aria-label="Основна информация">
                <div className="title">
                    <div className="section">
                        <div className="field">
                            <label htmlFor="f-title">Заглавие на обявата</label>
                            <InputText id="f-title" value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="Пример: 3-стаен с панорама в Лозенец" className="p-inputtext" style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700 }} />
                        </div>

                        <div className="loc-grid">
                            <div className="field"><label htmlFor="f-address">Адрес</label><InputText id="f-address" value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="ул. Пример 1" /></div>
                            <div className="field"><label htmlFor="f-city">Град</label><InputText id="f-city" value={form.location} onChange={(e) => setField('location', e.target.value)} placeholder="София" /></div>
                            <div className="field"><label htmlFor="f-district">Квартал</label><InputText id="f-district" value={form.district} onChange={(e) => setField('district', e.target.value)} placeholder="Лозенец" /></div>
                        </div>

                        <div className="specs-grid">
                            <div className="field"><label htmlFor="f-type">Тип</label><Dropdown inputId="f-type" value={form.propertyType} options={typeOptions} onChange={(e) => setField('propertyType', e.value)} placeholder="Изберете тип" /></div>
                            <div className="field"><label htmlFor="f-area">Площ</label><InputNumber inputId="f-area" value={form.area} onValueChange={(e) => setField('area', e.value || 0)} suffix=" м²" placeholder="Площ" /></div>
                            <div className="field"><label htmlFor="f-rooms">Стаи</label><InputNumber inputId="f-rooms" value={form.rooms} onValueChange={(e) => setField('rooms', e.value || 0)} placeholder="3" /></div>
                            <div className="field"><label htmlFor="f-baths">Бани</label><InputNumber inputId="f-baths" value={form.baths} onValueChange={(e) => setField('baths', (e.value as number) || 0)} placeholder="2" /></div>
                            <div className="field"><label htmlFor="f-floorNum">Етаж</label><InputNumber inputId="f-floorNum" value={form.floor} onValueChange={(e) => setField('floor', (e.value as number) || 0)} placeholder="6" min={0} /></div>
                            <div className="field"><label htmlFor="f-totalFloors">Етажи на сградата</label><InputNumber inputId="f-totalFloors" value={form.totalFloors} onValueChange={(e) => setField('totalFloors', (e.value as number) || 0)} placeholder="8" min={1} /></div>
                            <div className="field"><label htmlFor="f-year">Година</label><Calendar inputId="f-year" dateFormat="mm/yy" view="month" showIcon value={form.yearOfBuilding} onChange={(e) => setField('yearOfBuilding', e.value || undefined)} placeholder="2014" /></div>
                            {/* <Calendar
                                dateFormat="yy"
                                view="year"
                                showIcon
                                placeholder="Избери година на строителство"
                                name={OfferFormDataEnum.YearOfBuilding}
                                value={values[OfferFormDataEnum.YearOfBuilding]}
                                showButtonBar
                                onChange={onChange}
                                invalid={getHasFormError(OfferFormDataEnum.YearOfBuilding)}
                            /> */}
                        </div>
                    </div>

                    <div className="pricebox">
                        <div className="field price-input">
                            <label htmlFor="priceInput">Цена</label>
                            <InputNumber value={form.price} onValueChange={(e) => setField('price', e.value || 0)} mode="currency" currency="EUR" locale="bg-BG" inputId="priceInput" />
                            <div className="price-hint">{pricePerM2 ? `≈ € ${pricePerM2}/м²` : '— €/м²'}</div>
                        </div>
                        <div className="actions">
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <Checkbox inputId="isNew" checked={!!form.isNew} onChange={(e) => setField('isNew', e.checked)}></Checkbox>
                                <label htmlFor="isNew">Нова</label>
                                <Checkbox inputId="exclusive" checked={!!form.exclusive} onChange={(e) => setField('exclusive', e.checked)}></Checkbox>
                                <label htmlFor="exclusive">Ексклузив</label>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />

                <div className="stack">
                    <h3 className="section-title"><i className="pi pi-info-circle" style={{ marginRight: 8 }} />Описание</h3>
                    <InputTextarea value={form.description} onChange={(e) => setField('description', e.target.value)} autoResize rows={4} placeholder="Описание на имота" />

                    <Divider />

                    <h3 className="section-title"><i className="pi pi-list-check" style={{ marginRight: 8 }} />Особености</h3>
                    <div className="field">
                        <MultiSelect value={form.features} options={featureOptions} onChange={(e) => setField('features', e.value)} optionLabel="label" placeholder="Изберете особености" display="chip" itemTemplate={(opt) => (<span><i className={opt.icon} style={{ marginRight: 6 }} /> {opt.label}</span>)} />
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                            {form.features?.map(f => <Tag key={f} value={f} />)}
                        </div>
                    </div>

                    <Divider />

                    <h3 className="section-title"><i className="pi pi-tags" style={{ marginRight: 8 }} />Тагове</h3>
                    {/* <Chips value={form.tags || []} onChange={(e) => setField('tags', e.value)} allowDuplicate={false} separator="," placeholder="Добавете таг и натиснете Enter" /> */}

                    <Divider />

                    <h3 className="section-title"><i className="pi pi-images" style={{ marginRight: 8 }} />План</h3>
                    <div className="planph" style={{ height: 220, border: "1px dashed var(--border)", borderRadius: 12, display: 'grid', placeItems: 'center', color: '#64748b' }}>
                        Плейсхолдър за качване на план / PDF
                    </div>

                    <Divider />

                    <h3 className="section-title"><i className="pi pi-map-marker" style={{ marginRight: 8 }} />Локация</h3>
                    <div className="loc-grid">
                        <div className="field"><label htmlFor="l-address">Адрес</label><InputText id="l-address" value={form.address} onChange={(e) => setField('address', e.target.value)} /></div>
                        <div className="field"><label htmlFor="l-city">Град</label><InputText id="l-city" value={form.location} onChange={(e) => setField('location', e.target.value)} /></div>
                        <div className="field"><label htmlFor="l-district">Квартал</label><InputText id="l-district" value={form.district} onChange={(e) => setField('district', e.target.value)} /></div>
                    </div>
                    <div className="mapph" style={{ height: 320, border: "1px dashed var(--border)", borderRadius: 12, display: 'grid', placeItems: 'center', color: '#64748b' }}>
                        Карта (интеграция при нужда)
                    </div>

                    <Divider />

                    <h3 className="section-title"><i className="pi pi-calculator" style={{ marginRight: 8 }} />Финанси</h3>
                    {/* <MortgageCalculator price={form.priceEUR} /> */}
                </div>
            </article>

            <aside className="aside">
                <section className="card pad">
                    <div className="field"><label htmlFor="f-id">Идентификатор</label><InputText id="f-id" value={form._id} onChange={(e) => setField('_id', e.target.value)} /></div>
                    <div className="field"><label>Статус</label>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <Checkbox inputId="isNew2" checked={!!form.isNew} onChange={(e) => setField('isNew', e.checked)}></Checkbox>
                            <label htmlFor="isNew2">Нова</label>
                            <Checkbox inputId="exclusive2" checked={!!form.exclusive} onChange={(e) => setField('exclusive', e.checked)}></Checkbox>
                            <label htmlFor="exclusive2">Ексклузив</label>
                        </div>
                    </div>
                    <Divider />
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {/* <Button icon="pi pi-save" label="Запази" onClick={() => onSave(false)} /> */}
                        <Button icon="pi pi-upload" label="Публикувай" onClick={() => publish()} />
                    </div>
                </section>
            </aside>
        </section>
    )
}