import React, { useEffect, useMemo, useRef, useState } from "react";
import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Chips } from "primereact/chips";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import { CreditCalculator } from "../CreditCalculator/CreditCalculator";
import { CreateEditForm } from "../CreateEditForm/CreateEditForm";
import { CreateEditFormNew } from "../CreateEditFormNew/CreateEditFormNew";

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

function useEnsureCss() {
    useEffect(() => {
        const add = (id, href) => {
            if (!document.getElementById(id)) {
                const l = document.createElement("link");
                l.id = id;
                l.rel = "stylesheet";
                l.href = href;
                document.head.appendChild(l);
            }
        };
        add("comfortaa-font", "https://fonts.googleapis.com/css2?family=Comfortaa:wght@400..700&display=swap");
        add("primereact-core", "https://unpkg.com/primereact/resources/primereact.min.css");
        add("primereact-theme", "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css");
        add("primeicons", "https://unpkg.com/primeicons/primeicons.css");
    }, []);
}

function useInjectCss(css, id = "create-offer-css-v2") {
    useEffect(() => {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement("style");
            el.id = id;
            document.head.appendChild(el);
        }
        el.textContent = css;
    }, [css, id]);
}

function useCurrency() {
    return useMemo(() => new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }), []);
}

const featureOptions = [
    { label: "Асансьор", value: "Асансьор", icon: "pi pi-angle-double-up" },
    { label: "Паркинг", value: "Паркинг", icon: "pi pi-car" },
    { label: "Контролиран достъп", value: "Контролиран достъп", icon: "pi pi-shield" },
    { label: "Склад", value: "Склад", icon: "pi pi-box" },
    { label: "ТЕЦ", value: "ТЕЦ", icon: "pi pi-bolt" },
    { label: "Климатизация", value: "Климатизация", icon: "pi pi-snowflake" },
];

export const CreateOfferPageNew = () => {
    useEnsureCss();
    useInjectCss(CSS);
    const fmt = useCurrency();
    const toastRef = useRef(null);

    const [images, setImages] = useState([]);
    const [gIndex, setGIndex] = useState(0);
    const [manageOpen, setManageOpen] = useState(false);

    const [form, setForm] = useState({
        title: "",
        transaction: null,
        propertyType: null,
        location: "",
        district: "",
        address: "",
        price: null,
        area: null,
        rooms: null,
        baths: null,
        floor: null,
        totalFloors: null,
        year: "",
        heating: null,
        features: [],
        tags: [],
        description: ""
    });

    const pricePerM2 = form.area ? Math.round((form.price || 0) / form.area) : null;

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    function set<K extends keyof Listing>(key: K, value: Listing[K]) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    const featuresList = [
        "Асансьор",
        "Паркинг",
        "Контролиран достъп",
        "Склад",
        "Видео наблюдение",
        "Изолация",
        "Климатизация",
        "ТЕЦ"
    ];

    const validate = () => {
        const errs = [];
        if (!form.title.trim()) errs.push("Въведи заглавие");
        if (!form.transaction) errs.push("Избери тип на сделката");
        if (!form.propertyType) errs.push("Избери тип имот");
        if (!form.price || form.price <= 0) errs.push("Въведи цена");
        if (!form.area || form.area <= 0) errs.push("Въведи площ");
        if (!form.district.trim()) errs.push("Въведи квартал");
        if (images.length === 0) errs.push("Качи поне 1 снимка");
        return errs;
    };

    const saveDraft = () => {
        const errs = validate();
        if (errs.length) {
            toastRef.current?.show({ severity: "warn", summary: "Провери полетата", detail: errs.join(" • "), life: 2500 });
            return;
        }
        console.log("SAVE DRAFT", { ...form, imagesCount: images.length });
        toastRef.current?.show({ severity: "success", summary: "Черновата е запазена", life: 1800 });
    };
    const publish = () => {
        const errs = validate();
        if (errs.length) {
            //   toastRef.current?.show({ severity: "warn", summary: "Провери полетата", detail: errs.join(" • "), life: 2500 });
            return;
        }
        console.log("PUBLISH", { ...form, images });
        // toastRef.current?.show({ severity: "success", summary: "Обявата е създадена", life: 2000 });
    };

    const onFilesAdd = (files) => {
        const next = Array.from(files || []).map((f) => ({ file: f, url: URL.createObjectURL(f) }));
        // setImages((prev) => [...next, ...prev]);
        if (gIndex === 0 && next.length) setGIndex(0);
    };

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
        setGIndex((i) => Math.max(0, Math.min(i, images.length - 2)));
    };
    const moveImage = (idx, dir) => {
        setImages((prev) => {
            const arr = [...prev];
            const ni = idx + dir;
            if (ni < 0 || ni >= arr.length) return prev;
            const [it] = arr.splice(idx, 1);
            arr.splice(ni, 0, it);
            return arr;
        });
    };

    const typeOptions = ["Апартамент", "Къща", "Мезонет", "Ателие"].map(t => ({ label: t, value: t }));


    return (
        <div className="create-offer-page-new">
            <Toast ref={toastRef} />
            {/* <header className="header">
                <div className="container header-inner">
                    <div className="logo"><span className="dot" /> Acme Estates</div>
                    <nav style={{ display: "flex", gap: 8 }}>
                        <Button label="Купи" text />
                        <Button label="Наеми" text />
                        <Button label="Моите обяви" icon="pi pi-user" />
                    </nav>
                </div>
            </header> */}

            <main className="container" style={{ marginTop: 16 }}>
                <div className="card gallery">
                    <div className="overlay-top" />
                    <div className="badges">
                        <Tag value="СЪЗДАВАНЕ" rounded severity="info" />
                        {form.tags[0] && <Tag value={form.tags[0]} rounded />}
                    </div>
                    <div className="fav">
                        <Button icon="pi pi-images" label="Управление снимки" onClick={() => setManageOpen(true)} raised />
                    </div>

                    {images.length === 0 ? (
                        <div className="placeholder-slide">
                            <div className="placeholder-inner">
                                <i className="pi pi-images" style={{ fontSize: 28 }} />
                                <div>Плъзни снимки тук или използвай бутона</div>
                                <Button icon="pi pi-upload" label="Качи снимки" onClick={() => setManageOpen(true)} />
                            </div>
                        </div>
                    ) : (
                        <Galleria
                            //   value={images.map((i) => i.url)}
                            numVisible={1}
                            circular
                            showThumbnails={false}
                            showIndicators
                            showItemNavigators
                            activeIndex={gIndex}
                            onItemChange={(e) => setGIndex(e.index)}
                            item={(src) => (
                                <img src={src} alt="Снимка" className="galleria-img" />
                            )}
                        />
                    )}
                </div>

                <h1>TESSST</h1>
                <CreateEditFormNew />
                {/* <section className="main" style={{ marginTop: 16 }}>
                    <article className="card pad content" aria-label="Основни полета">
                        <div className="title">
                            <div>
                                <h1 className="h1">Създай обява</h1>
                                <div className="sub">Полетата със * са задължителни</div>
                            </div>
                            <div className="pricebox">
                                <div className="field">
                                    <label>Цена (€)*</label>
                                    <InputNumber value={form.price} onValueChange={(e) => setField("price", e.value ?? null)} mode="currency" currency="EUR" locale="bg-BG" placeholder="0" inputStyle={{ width: 260, fontWeight: 900, fontSize: 20 }} />
                                </div>
                                <div className="sub">{pricePerM2 ? `≈ € ${pricePerM2}/м²` : "—"}</div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <Button icon="pi pi-save" label="Запази чернова" onClick={saveDraft} raised />
                                    <Button icon="pi pi-check" label="Създай обява" severity="success" onClick={publish} raised />
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div className="stack">
                            <div className="field">
                                <label>Заглавие*</label>
                                <InputText value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="3-стаен апартамент с панорама в Лозенец" />
                            </div>
                            <div className="field">
                                <label>Кратко описание</label>
                                <InputTextarea value={form.description || ""} onChange={(e) => setField("description", e.target.value)} autoResize rows={4} placeholder="Ключови акценти за имота…" />
                            </div>
                        </div>

                        <Divider />

                        <h3 className="section-title"><i className="pi pi-list" />Основни параметри</h3>
                        <div className="grid-3">
                            <div className="field">
                                <label>Тип на сделката*</label>
                                <Dropdown value={form.transaction} onChange={(e) => setField("transaction", e.value)} options={["Продажба", "Наем"]} placeholder="Избери" showClear className="w-full" appendTo={document.body} panelClassName="dd-solid" />
                            </div>
                            <div className="field">
                                <label>Тип имот*</label>
                                <Dropdown value={form.propertyType} onChange={(e) => setField("propertyType", e.value)} options={["Апартамент", "Къща", "Офис", "Парцел"]} placeholder="Избери" showClear className="w-full" appendTo={document.body} panelClassName="dd-solid" />
                            </div>
                            <div className="field">
                                <label>Площ (м²)*</label>
                                <InputNumber value={form.area} onValueChange={(e) => setField("area", e.value ?? null)} suffix=" м²" min={0} placeholder="0" />
                            </div>

                            <div className="field">
                                <label>Стаи</label>
                                <InputNumber value={form.rooms} onValueChange={(e) => setField("rooms", e.value ?? null)} min={0} placeholder="0" />
                            </div>
                            <div className="field">
                                <label>Бани</label>
                                <InputNumber value={form.baths} onValueChange={(e) => setField("baths", e.value ?? null)} min={0} placeholder="0" />
                            </div>
                            <div className="field">
                                <label>Отопление</label>
                                <Dropdown value={form.heating} onChange={(e) => setField("heating", e.value)} options={["ТЕЦ", "Електричество", "Газ", "Климатизация", "Подово"]} placeholder="Избери" showClear appendTo={document.body} panelClassName="dd-solid" />
                            </div>

                            <div className="field">
                                <label>Етаж</label>
                                <InputNumber value={form.floor} onValueChange={(e) => setField("floor", e.value ?? null)} min={0} placeholder="0" />
                            </div>
                            <div className="field">
                                <label>Етажност</label>
                                <InputNumber value={form.totalFloors} onValueChange={(e) => setField("totalFloors", e.value ?? null)} min={0} placeholder="0" />
                            </div>
                            <div className="field">
                                <label>Година на строеж</label>
                                <InputNumber value={form.year ? Number(form.year) : null} onValueChange={(e) => setField("year", e.value ?? "")} min={1800} max={2100} useGrouping={false} placeholder="напр. 2014" />
                            </div>
                        </div>

                        <Divider />

                        <h3 className="section-title"><i className="pi pi-map-marker" />Локация</h3>
                        <div className="grid-3">
                            <div className="field">
                                <label>Град*</label>
                                <InputText value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="София" />
                            </div>
                            <div className="field">
                                <label>Квартал*</label>
                                <InputText value={form.district} onChange={(e) => setField("district", e.target.value)} placeholder="Лозенец" />
                            </div>
                            <div className="field">
                                <label>Адрес</label>
                                <InputText value={form.address} onChange={(e) => setField("address", e.target.value)} placeholder="ул. Пример 12" />
                            </div>
                        </div>

                        <Divider />

                        <h3 className="section-title"><i className="pi pi-list-check" />Особености</h3>
                        <div className="grid-2">
                            <div className="field">
                                <label>Удобства</label>
                                <div className="amenities">
                                    {featuresList.map((f) => {
                                        const id = 'amenity-' + f.split(' ').join('-').toLowerCase(); return (
                                            <div key={f} className="amenity">
                                                <Checkbox inputId={id} checked={form.features.includes(f)} onChange={(e) => {
                                                    setForm((prev) => {
                                                        const set = new Set(prev.features);
                                                        e.checked ? set.add(f) : set.delete(f);
                                                        return { ...prev, features: [...set] };
                                                    });
                                                }} />
                                                <label htmlFor={id} className="amenity-label">{f}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="field">
                                <label>Тагове</label>
                                <Chips value={form.tags} onChange={(e) => setField("tags", e.value)} separator="," placeholder="Нова, Гледка, Тераса" />
                                <small className="hint">Натисни Enter или сложи запетая за да добавиш таг.</small>
                            </div>
                        </div>

                        <Divider />
                        <h3 className="section-title"><i className="pi pi-file" />Документи</h3>
                        <div className="sub">След публикуване ще можеш да прикачиш документи.</div>
                    </article>

                    <aside className="aside">
                        <section className="card pad">
                            <div className="sub">Резюме</div>
                            <div className="price">{fmt.format(form.price || 0)}</div>
                            <div className="sub">{pricePerM2 ? `≈ € ${pricePerM2}/м²` : "—"}</div>
                            <Divider />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                <Tag value={form.propertyType || "—"} icon="pi pi-home" />
                                <Tag value={form.transaction || "—"} icon="pi pi-briefcase" severity={form.transaction === "Продажба" ? "success" : "info"} />
                                <Tag value={`${form.area || 0} м²`} icon="pi pi-expand" />
                                <Tag value={`${form.rooms || 0} стаи`} icon="pi pi-table" />
                            </div>
                            <Divider />
                            <div className="cta-grid">
                                <Button icon="pi pi-eye" label="Преглед" outlined />
                                <Button icon="pi pi-save" label="Чернова" onClick={saveDraft} />
                                <Button className="wide" icon="pi pi-check" label="Публикувай" severity="success" onClick={publish} />
                            </div>
                        </section>

                        <section className="card pad">
                            <div className="sub">Съвет</div>
                            <p style={{ margin: "6px 0" }}>Качи 8–15 качествени снимки и започни с най-силните – те се виждат първи.</p>
                        </section>
                    </aside>
                </section> */}
                <section className="main" style={{ marginTop: 16 }}>
                    <article className="card pad content" aria-label="Основна информация">
                        <div className="title">
                            <div className="section">
                                <div className="field">
                                    <label htmlFor="f-title">Заглавие на обявата</label>
                                    <InputText id="f-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Пример: 3-стаен с панорама в Лозенец" className="p-inputtext" style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700 }} />
                                </div>

                                <div className="loc-grid">
                                    <div className="field"><label htmlFor="f-address">Адрес</label><InputText id="f-address" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="ул., №" /></div>
                                    <div className="field"><label htmlFor="f-city">Град</label><InputText id="f-city" value={form.location} onChange={(e) => set('city', e.target.value)} placeholder="София" /></div>
                                    <div className="field"><label htmlFor="f-district">Квартал</label><InputText id="f-district" value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="Лозенец" /></div>
                                </div>

                                <div className="specs-grid">
                                    <div className="field"><label htmlFor="f-type">Тип</label><Dropdown inputId="f-type" value={form.propertyType} options={typeOptions} onChange={(e) => set('type', e.value)} placeholder="Изберете тип" /></div>
                                    <div className="field"><label htmlFor="f-area">Площ</label><InputNumber inputId="f-area" value={form.area} onValueChange={(e) => set('areaM2', e.value || 0)} suffix=" м²" placeholder="Площ" /></div>
                                    <div className="field"><label htmlFor="f-rooms">Стаи</label><InputNumber inputId="f-rooms" value={form.rooms} onValueChange={(e) => set('rooms', e.value || 0)} placeholder="3" /></div>
                                    <div className="field"><label htmlFor="f-baths">Бани</label><InputNumber inputId="f-baths" value={form.baths} onValueChange={(e) => set('baths', e.value || 0)} placeholder="2" /></div>
                                    <div className="field"><label htmlFor="f-floorNum">Етаж</label><InputNumber inputId="f-floorNum" value={Number(form.floor)} onValueChange={(e) => set('floorNumber', (e.value as number) || 0)} placeholder="6" min={0} /></div>
                                    <div className="field"><label htmlFor="f-totalFloors">Етажи на сградата</label><InputNumber inputId="f-totalFloors" value={form.totalFloors} onValueChange={(e) => set('totalFloors', (e.value as number) || 0)} placeholder="8" min={1} /></div>
                                    <div className="field"><label htmlFor="f-year">Година</label><InputNumber inputId="f-year" value={Number(form.year)} onValueChange={(e) => set('year', e.value || undefined)} placeholder="2014" /></div>
                                </div>
                            </div>

                            <div className="pricebox">
                                <div className="field price-input">
                                    <label htmlFor="priceInput">Цена</label>
                                    <InputNumber value={form.price} onValueChange={(e) => set('priceEUR', e.value || 0)} mode="currency" currency="EUR" locale="bg-BG" inputId="priceInput" />
                                    <div className="price-hint">{pricePerM2 ? `≈ € ${pricePerM2}/м²` : '— €/м²'}</div>
                                </div>
                                <div className="actions">
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                        <Checkbox inputId="isNew" checked={!!form.isNew} onChange={(e) => set('isNew', e.checked)}></Checkbox>
                                        <label htmlFor="isNew">Нова</label>
                                        <Checkbox inputId="exclusive" checked={!!form.exclusive} onChange={(e) => set('exclusive', e.checked)}></Checkbox>
                                        <label htmlFor="exclusive">Ексклузив</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Divider />

                        <div className="stack">
                            <h3 className="section-title"><i className="pi pi-info-circle" style={{ marginRight: 8 }} />Описание</h3>
                            <InputTextarea value={form.description} onChange={(e) => set('description', e.target.value)} autoResize rows={4} placeholder="Описание на имота" />

                            <Divider />

                            <h3 className="section-title"><i className="pi pi-list-check" style={{ marginRight: 8 }} />Особености</h3>
                            <div className="field">
                                <MultiSelect value={form.features} options={featureOptions} onChange={(e) => set('features', e.value)} optionLabel="label" placeholder="Изберете особености" display="chip" itemTemplate={(opt) => (<span><i className={opt.icon} style={{ marginRight: 6 }} /> {opt.label}</span>)} />
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                                    {form.features.map(f => <Tag key={f} value={f} />)}
                                </div>
                            </div>

                            <Divider />

                            <h3 className="section-title"><i className="pi pi-tags" style={{ marginRight: 8 }} />Тагове</h3>
                            {/* <Chips value={form.tags || []} onChange={(e) => set('tags', e.value)} allowDuplicate={false} separator="," placeholder="Добавете таг и натиснете Enter" /> */}

                            <Divider />

                            <h3 className="section-title"><i className="pi pi-images" style={{ marginRight: 8 }} />План</h3>
                            <div className="planph" style={{ height: 220, border: "1px dashed var(--border)", borderRadius: 12, display: 'grid', placeItems: 'center', color: '#64748b' }}>
                                Плейсхолдър за качване на план / PDF
                            </div>

                            <Divider />

                            <h3 className="section-title"><i className="pi pi-map-marker" style={{ marginRight: 8 }} />Локация</h3>
                            <div className="loc-grid">
                                <div className="field"><label htmlFor="l-address">Адрес</label><InputText id="l-address" value={form.address} onChange={(e) => set('address', e.target.value)} /></div>
                                <div className="field"><label htmlFor="l-city">Град</label><InputText id="l-city" value={form.city} onChange={(e) => set('city', e.target.value)} /></div>
                                <div className="field"><label htmlFor="l-district">Квартал</label><InputText id="l-district" value={form.district} onChange={(e) => set('district', e.target.value)} /></div>
                            </div>
                            <div className="mapph" style={{ height: 320, border: "1px dashed var(--border)", borderRadius: 12, display: 'grid', placeItems: 'center', color: '#64748b' }}>
                                Карта (интеграция при нужда)
                            </div>

                            <Divider />

                            <h3 className="section-title"><i className="pi pi-calculator" style={{ marginRight: 8 }} />Финанси</h3>
                            {/* <CreditCalculator price={Number(form.price)} /> */}
                        </div>
                    </article>

                    <aside className="aside">
                        <section className="card pad">
                            <div className="field"><label htmlFor="f-id">Идентификатор</label><InputText id="f-id" value={form.id} onChange={(e) => set('id', e.target.value)} /></div>
                            <div className="field"><label>Статус</label>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <Checkbox inputId="isNew2" checked={!!form.isNew} onChange={(e) => set('isNew', e.checked)}></Checkbox>
                                    <label htmlFor="isNew2">Нова</label>
                                    <Checkbox inputId="exclusive2" checked={!!form.exclusive} onChange={(e) => set('exclusive', e.checked)}></Checkbox>
                                    <label htmlFor="exclusive2">Ексклузив</label>
                                </div>
                            </div>
                            <Divider />
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {/* <Button icon="pi pi-save" label="Запази" onClick={() => onPublish(false)} /> */}
                                <Button icon="pi pi-upload" label="Публикувай" onClick={() => publish()} />
                            </div>
                        </section>
                    </aside>
                </section>
            </main>

            {/* <CreateEditForm /> */}

            <Dialog header={(<span><i className="pi pi-images" style={{ marginRight: 8 }} />Управление на снимки</span>)} visible={manageOpen} style={{ width: "min(980px, 96vw)" }} modal onHide={() => setManageOpen(false)}>
                <div className="drop-tile">
                    <div className="drop-inner">
                        <i className="pi pi-upload" style={{ fontSize: 24 }} />
                        <div>Плъзни снимки тук или използвай бутона</div>
                        <FileUpload name="images[]" accept="image/*" multiple customUpload auto uploadHandler={(e) => onFilesAdd(e.files)} chooseLabel="Избери" emptyTemplate={<span />} />
                    </div>
                </div>
                <Divider />
                <div className="thumb-grid">
                    {images.length === 0 && <div className="sub">Все още няма качени снимки.</div>}
                    {images.map((im, idx) => (
                        <div className="thumb" key={idx}>
                            {/* <img src={im.url} alt={`thumb ${idx+1}`} /> */}
                            <div className="actions">
                                <div style={{ display: "flex", gap: 6 }}>
                                    <Button icon="pi pi-arrow-left" rounded text onClick={() => moveImage(idx, -1)} disabled={idx === 0} />
                                    <Button icon="pi pi-arrow-right" rounded text onClick={() => moveImage(idx, 1)} disabled={idx === images.length - 1} />
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => removeImage(idx)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Dialog>
        </div>
    );
}
