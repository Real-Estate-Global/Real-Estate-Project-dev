import React, { useEffect, useMemo, useRef, useState } from "react";
import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Chips } from "primereact/chips";
import { FileUpload } from "primereact/fileupload";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useParams } from "react-router-dom";
import { useGetMyOfferQuery } from "../../store/api/privateOffers";
import { useAppSelector } from "../../store/hooks";
import { authSliceSelectors } from "../../store/slices/auth";
import { MyOffers } from "../MyOffers/MyOffers";

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

const DEMO: Listing = {
    id: "LOZ-3217",
    title: "3-стаен апартамент с панорама в кв. Лозенец",
    priceEUR: 289000,
    address: "ул. „Крушова градина“ 12",
    city: "София",
    district: "Лозенец",
    areaM2: 112,
    rooms: 3,
    baths: 2,
    floorNumber: 6,
    totalFloors: 8,
    year: 2014,
    type: "Апартамент",
    images: [
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["Тераса", "Гледка"],
    exclusive: true,
    isNew: true,
    description:
        "Светъл и просторен апартамент с невероятна панорамна гледка към Витоша. Функционално разпределение, висок клас довършителни работи, подземно паркомясто.",
    features: ["Асансьор", "Паркинг", "Контролиран достъп", "Склад", "ТЕЦ", "Климатизация"],
};

const STYLE_ID = "listing-edit-prime-v3";

function useEnsureCss() {
    useEffect(() => {
        if (!document.getElementById(STYLE_ID)) {
            const s = document.createElement("style"); s.id = STYLE_ID; document.head.appendChild(s);
        }
        const links: [string, string][] = [
            ["primeicons-link", "https://unpkg.com/primeicons/primeicons.css"],
            ["primereact-core", "https://unpkg.com/primereact/resources/primereact.min.css"],
            ["primereact-theme", "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css"],
        ];
        links.forEach(([id, href]) => {
            if (!document.getElementById(id)) {
                const l = document.createElement("link"); l.id = id; l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
            }
        });
    }, []);
}

function useCurrency() {
    return useMemo(() => new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR" }), []);
}

const featureOptions = [
    { label: "Асансьор", value: "Асансьор", icon: "pi pi-angle-double-up" },
    { label: "Паркинг", value: "Паркинг", icon: "pi pi-car" },
    { label: "Контролиран достъп", value: "Контролиран достъп", icon: "pi pi-shield" },
    { label: "Склад", value: "Склад", icon: "pi pi-box" },
    { label: "ТЕЦ", value: "ТЕЦ", icon: "pi pi-bolt" },
    { label: "Климатизация", value: "Климатизация", icon: "pi pi-snowflake" },
];

const typeOptions = ["Апартамент", "Къща", "Мезонет", "Ателие"].map(t => ({ label: t, value: t }));

export const EditOfferPage = () => {
    const { _id } = useParams();
    const getMyOfferQuery = useGetMyOfferQuery(_id as string);
    const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);
    const myOffer = getMyOfferQuery.data

    console.log("IMPORTANT", getMyOfferQuery)


    // if (!isAuthenticated) {
    //     // TODO: better please login
    //     return <div>Please Login</div>;
    // }
    useEnsureCss();
    const toast = useRef<Toast>(null);
    const fmt = useCurrency();

    const [form, setForm] = useState<Listing>({ ...DEMO });
    const [activeIndex, setActiveIndex] = useState(0);
    const [imgManagerOpen, setImgManagerOpen] = useState(false);
    const [urlToAdd, setUrlToAdd] = useState("");

    const pricePerM2 = useMemo(() => {
        const v = (form.priceEUR || 0) / (form.areaM2 || 0);
        return isFinite(v) && v > 0 ? Math.round(v) : 0;
    }, [form.priceEUR, form.areaM2]);

    function set<K extends keyof Listing>(key: K, value: Listing[K]) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    function onSave(publish = false) {
        const required = [
            [!!form.title, "Заглавието е задължително"],
            [!!form.city, "Моля, посочете град"],
            [!!form.district, "Моля, посочете квартал"],
            [!!form.areaM2, "Моля, въведете площ"],
            [!!form.priceEUR, "Моля, въведете цена"],
        ];
        const missing = required.find(([ok]) => !ok) as [boolean, string] | undefined;
        if (missing) { toast.current?.show({ severity: 'warn', summary: missing[1], life: 2200 }); return; }
        console.log(publish ? "PUBLISH" : "SAVE", form);
        toast.current?.show({ severity: 'success', summary: publish ? 'Обявата е публикувана' : 'Записано като чернова', life: 2000 });
    }

    function removeImage(i: number) { setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) })); }
    function addImageUrl() { if (!urlToAdd.trim()) return; setForm(f => ({ ...f, images: [urlToAdd.trim(), ...f.images] })); setUrlToAdd(""); }
    function onFilesSelected(files: File[] | FileList | null) { if (!files) return; const list = Array.from(files as any as File[]); const urls = list.map(f => URL.createObjectURL(f)); setForm(f => ({ ...f, images: [...urls, ...f.images] })); }

    const dragIndex = useRef<number | null>(null);
    function onDragStart(i: number) { dragIndex.current = i; }
    function onDrop(i: number) { if (dragIndex.current === null) return; setForm(f => { const arr = [...f.images]; const [m] = arr.splice(dragIndex.current!, 1); arr.splice(i, 0, m); return { ...f, images: arr }; }); dragIndex.current = null; }


    const myOfferPhotosUrls = myOffer?.images.map((img) => img.url)


    return (
        <div className="edit-offer-page">
            <Toast ref={toast} />

            <header className="header">
                <div className="container header-inner">
                    <div className="logo"><span className="dot" /> Acme Estates</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button label="Запази чернова" icon="pi pi-save" onClick={() => onSave(false)} />
                        <Button label="Публикувай" icon="pi pi-upload" onClick={() => onSave(true)} />
                    </div>
                </div>
            </header>

            <main className="container" style={{ marginTop: 16 }}>
                <div className="card gallery" onClick={() => setImgManagerOpen(true)} role="button" aria-label="Редактирай снимките">
                    <div className="overlay-top" />
                    <div className="badges">
                        {form.isNew && <Tag value="НОВА" severity="info" rounded />}
                        {form.exclusive && <Tag value="ЕКСКЛУЗИВ" severity="success" rounded />}
                        {(form.tags || []).map(t => <Tag key={t} value={t} rounded />)}
                    </div>
                    <div className="gallery-edit">
                        <Button icon="pi pi-images" rounded aria-label="Редакция на снимки" />
                    </div>
                    <Galleria value={myOfferPhotosUrls} numVisible={1} circular showThumbnails={false} showIndicators showItemNavigators activeIndex={activeIndex} onItemChange={(e) => setActiveIndex(e.index)} item={(src) => <img src={src as string} alt={form.title} />} />
                </div>

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
                                    <div className="field"><label htmlFor="f-city">Град</label><InputText id="f-city" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="София" /></div>
                                    <div className="field"><label htmlFor="f-district">Квартал</label><InputText id="f-district" value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="Лозенец" /></div>
                                </div>

                                <div className="specs-grid">
                                    <div className="field"><label htmlFor="f-type">Тип</label><Dropdown inputId="f-type" value={form.type} options={typeOptions} onChange={(e) => set('type', e.value)} placeholder="Изберете тип" /></div>
                                    <div className="field"><label htmlFor="f-area">Площ</label><InputNumber inputId="f-area" value={form.areaM2} onValueChange={(e) => set('areaM2', e.value || 0)} suffix=" м²" placeholder="Площ" /></div>
                                    <div className="field"><label htmlFor="f-rooms">Стаи</label><InputNumber inputId="f-rooms" value={form.rooms} onValueChange={(e) => set('rooms', e.value || 0)} placeholder="3" /></div>
                                    <div className="field"><label htmlFor="f-baths">Бани</label><InputNumber inputId="f-baths" value={form.baths} onValueChange={(e) => set('baths', e.value || 0)} placeholder="2" /></div>
                                    <div className="field"><label htmlFor="f-floorNum">Етаж</label><InputNumber inputId="f-floorNum" value={form.floorNumber} onValueChange={(e) => set('floorNumber', (e.value as number) || 0)} placeholder="6" min={0} /></div>
                                    <div className="field"><label htmlFor="f-totalFloors">Етажи на сградата</label><InputNumber inputId="f-totalFloors" value={form.totalFloors} onValueChange={(e) => set('totalFloors', (e.value as number) || 0)} placeholder="8" min={1} /></div>
                                    <div className="field"><label htmlFor="f-year">Година</label><InputNumber inputId="f-year" value={form.year} onValueChange={(e) => set('year', e.value || undefined)} placeholder="2014" /></div>
                                </div>
                            </div>

                            <div className="pricebox">
                                <div className="field price-input">
                                    <label htmlFor="priceInput">Цена</label>
                                    <InputNumber value={form.priceEUR} onValueChange={(e) => set('priceEUR', e.value || 0)} mode="currency" currency="EUR" locale="bg-BG" inputId="priceInput" />
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
                            <MortgageCalculator price={form.priceEUR} />
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
                                <Button icon="pi pi-save" label="Запази" onClick={() => onSave(false)} />
                                <Button icon="pi pi-upload" label="Публикувай" onClick={() => onSave(true)} />
                            </div>
                        </section>
                    </aside>
                </section>

                <footer style={{ margin: '26px 0', color: '#64748b' }}>© 2025 Acme Estates — страница за редакция</footer>
            </main>

            <Dialog header="Управление на снимки" visible={imgManagerOpen} style={{ width: 'min(980px, 94vw)' }} onHide={() => setImgManagerOpen(false)}>
                <div className="img-manager">
                    <div className="drop-tile" onDragOver={(e) => { e.preventDefault(); }} onDrop={(e) => { e.preventDefault(); onFilesSelected(e.dataTransfer?.files || null); }}>
                        <FileUpload name="images[]" accept="image/*" multiple auto customUpload onSelect={(e: any) => onFilesSelected(e.files)} chooseLabel="Изберете или пуснете тук" emptyTemplate={<div className="drop-hint"><i className="pi pi-images" style={{ fontSize: 28 }} /><div>Плъзнете снимки тук</div><small>или клик за избор</small></div>} />
                    </div>
                    <div className="img-grid">
                        {form.images.map((src, i) => (
                            <div key={i} className="thumb" draggable onDragStart={() => onDragStart(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(i)}>
                                <img src={src} alt={`img-${i}`} />
                                <Button className="remove" icon="pi pi-times" rounded text aria-label="Премахни" onClick={() => removeImage(i)} />
                            </div>
                        ))}
                    </div>
                </div>
                <Divider />
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <InputText value={urlToAdd} onChange={(e) => setUrlToAdd(e.target.value)} placeholder="Вмъкни URL на снимка" style={{ minWidth: 280 }} />
                    <Button label="Добави URL" onClick={addImageUrl} />
                </div>
                <div style={{ marginTop: 6 }} className="sub">Файловете от dropzone се добавят най-отпред. Влачете миниатюри за пренареждане. ✕ премахва снимка.</div>
            </Dialog>
        </div>
    );
}

function MortgageCalculator({ price }: { price: number }) {
    const fmt = useCurrency();
    const [amount, setAmount] = useState<number>(price);
    const [downPct, setDownPct] = useState<number>(20);
    const [ratePct, setRatePct] = useState<number>(2.8);
    const [years, setYears] = useState<number>(30);
    const monthly = useMemo(() => {
        const P = amount * (1 - downPct / 100);
        const r = (ratePct / 100) / 12;
        const n = years * 12;
        const m = r === 0 ? (P / n) : (P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
        return isFinite(m) ? m : 0;
    }, [amount, downPct, ratePct, years]);
    return (
        <div className="calc">
            <div className="form-row">
                <div className="field">
                    <label htmlFor="mc-price">Цена (€)</label>
                    <InputNumber inputId="mc-price" value={amount} onValueChange={(e) => setAmount(e.value || 0)} mode="currency" currency="EUR" locale="bg-BG" />
                </div>
                <div className="field">
                    <label htmlFor="mc-down">Първоначална вноска (%)</label>
                    <InputNumber inputId="mc-down" value={downPct} onValueChange={(e) => setDownPct(e.value || 0)} suffix="%" min={0} max={100} />
                </div>
                <div className="field">
                    <label htmlFor="mc-rate">Лихва (% год.)</label>
                    <InputNumber inputId="mc-rate" value={ratePct} onValueChange={(e) => setRatePct(e.value || 0)} suffix="%" min={0} step={0.1} />
                </div>
                <div className="field">
                    <label htmlFor="mc-years">Срок (години)</label>
                    <InputNumber inputId="mc-years" value={years} onValueChange={(e) => setYears(e.value || 0)} min={1} max={40} />
                </div>
            </div>
            <Divider />
            <div style={{ fontWeight: 900, fontSize: 22 }}>Месечна вноска: {fmt.format(monthly)}</div>
            <div className="sub">Ориентировъчно изчисление. За точна оферта се свържете с кредитен консултант.</div>
        </div>
    );
}
