import React, { useMemo, useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { SelectButton } from "primereact/selectbutton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const STYLE_ID = "pricing-prime-v3";
const CSS_TEXT = `
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400..700&display=swap');
:root{ --bg:#f8fafc; --surface:#ffffff; --muted:#64748b; --text:#0f172a; --primary:#3858CF; --border:#e2e8f0; --ring:rgba(56,88,207,.28) }
*{ box-sizing:border-box }
body{ margin:0; font-family:"Comfortaa", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; background:var(--bg); color:var(--text) }
.container{ width:min(1200px,92vw); margin-inline:auto }
.header{ position:sticky; top:0; z-index:50; backdrop-filter:saturate(1.05) blur(8px); background:color-mix(in oklab, var(--bg), transparent 25%); border-bottom:1px solid var(--border) }
.header-inner{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 0 }
.logo{ display:flex; gap:10px; align-items:center; font-weight:900 }
.logo .dot{ width:12px; height:12px; border-radius:999px; background:linear-gradient(180deg, color-mix(in oklab, var(--primary), #fff 25%), var(--primary)) }

.hero{ text-align:center; padding:28px 0 10px }
.hero h1{ margin:0; font-size: clamp(24px, 3.6vw, 40px) }
.hero p{ margin:8px 0 0; color:var(--muted) }

.toggle{ display:flex; gap:10px; align-items:center; justify-content:center; margin:18px 0 }
.save-pill{ font-size:12px; color:#14532d; background:#dcfce7; border:1px solid #bbf7d0; padding:6px 10px; border-radius:999px }

.grid{ display:grid; grid-template-columns: repeat(3, minmax(260px,1fr)); gap:16px; align-items:stretch }
.card{ border:1px solid var(--border); border-radius:16px; overflow:hidden; background:var(--surface); box-shadow:0 10px 24px rgba(2,6,23,.06); height:100% }
.plan-card{ display:flex; flex-direction:column; gap:12px; height:100% }
.plan-head{ display:flex; flex-direction:column; align-items:center; gap:6px }
.plan-name{ font-size:18px; font-weight:900 }
.price-row{ display:flex; flex-direction:column; align-items:center; gap:2px }
.price{ font-size: clamp(22px, 3vw, 34px); font-weight:900; text-align:center }
.per{ color:var(--muted); font-size:14px; text-align:center }
.features{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; flex:1 }
.features li{ display:grid; grid-template-columns: 20px 1fr; gap:10px; align-items:start }
.features .incl{ color:#16a34a }
.features .excl{ color:#94a3b8 }
.cta{ display:flex; flex-direction:column; gap:10px }
.badge-inline{ margin-left:8px }
.small{ font-size:12px; color:var(--muted) }

.table-wrap{ margin-top:26px }

footer{ margin:38px 0; color:var(--muted); font-size:14px; text-align:center }

@media (max-width: 980px){
  .grid{ grid-template-columns: 1fr }
}
`;

function useEnsureCss() {
    useEffect(() => {
        if (!document.getElementById(STYLE_ID)) {
            const s = document.createElement("style"); s.id = STYLE_ID; s.textContent = CSS_TEXT; document.head.appendChild(s);
        }
        const links: [string, string][] = [
            ["primeicons-link", "https://unpkg.com/primeicons/primeicons.css"],
            ["primereact-core", "https://unpkg.com/primereact/resources/primereact.min.css"],
            ["primereact-theme", "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css"],
        ];
        links.forEach(([id, href]) => { if (!document.getElementById(id)) { const l = document.createElement("link"); l.id = id; l.rel = "stylesheet"; l.href = href; document.head.appendChild(l); } });
    }, []);
}

function useCurrency() {
    return useMemo(() => new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }), []);
}

const YEARLY_DISCOUNT = 0.17;

type Billing = "monthly" | "yearly";

type Plan = {
    id: string;
    name: string;
    priceMonthly: number;
    listings: number | "unlimited";
    photosPerListing: number;
    featuredPerMonth: number;
    aiAssistant: string;
    analytics: "None" | "Basic" | "Pro";
    teamSeats?: number | "unlimited";
    apiAccess?: "None" | "Read" | "Full";
    whiteLabel?: boolean;
    crmExport?: boolean;
    bulkImport?: boolean;
    prioritySupport?: boolean;
    spotlightDays?: number;
    popular?: boolean;
};

const PLANS: Plan[] = [
    {
        id: "starter",
        name: "Starter",
        priceMonthly: 19,
        listings: 5,
        photosPerListing: 20,
        featuredPerMonth: 1,
        aiAssistant: "100 съобщ./мес.",
        analytics: "Basic",
        teamSeats: 1,
        apiAccess: "Read",
        whiteLabel: false,
        crmExport: true,
        bulkImport: false,
        prioritySupport: false,
    },
    {
        id: "pro",
        name: "Pro",
        priceMonthly: 49,
        listings: 25,
        photosPerListing: 40,
        featuredPerMonth: 4,
        aiAssistant: "Неограничен",
        analytics: "Pro",
        teamSeats: 3,
        apiAccess: "Full",
        whiteLabel: true,
        crmExport: true,
        bulkImport: true,
        prioritySupport: true,
        spotlightDays: 2,
        popular: true,
    },
    {
        id: "business",
        name: "Business",
        priceMonthly: 99,
        listings: 100,
        photosPerListing: 60,
        featuredPerMonth: 12,
        aiAssistant: "Неогр. + Екип",
        analytics: "Pro",
        teamSeats: 8,
        apiAccess: "Full",
        whiteLabel: true,
        crmExport: true,
        bulkImport: true,
        prioritySupport: true,
        spotlightDays: 7,
    },
];

const FEATURE_ROWS: { key: keyof Plan; label: string; type?: 'bool' | 'value'; formatter?: (v: any) => string }[] = [
    { key: 'listings', label: 'Обяви', type: 'value', formatter: v => v === 'unlimited' ? 'Неограничени' : `${v}` },
    { key: 'photosPerListing', label: 'Снимки на обява', type: 'value', formatter: v => `До ${v}` },
    { key: 'featuredPerMonth', label: 'Буустове / месец', type: 'value', formatter: v => v > 0 ? `${v}` : '—' },
    { key: 'aiAssistant', label: 'AI асистент', type: 'value' },
    { key: 'analytics', label: 'Анализи', type: 'value', formatter: v => v === 'None' ? '—' : v },
    { key: 'teamSeats', label: 'Места в екипа', type: 'value', formatter: v => v === 'unlimited' ? 'Неогр.' : v },
    { key: 'crmExport', label: 'CRM експорт', type: 'bool' },
    { key: 'apiAccess', label: 'API достъп', type: 'value', formatter: v => v === 'None' ? '—' : v },
    { key: 'bulkImport', label: 'Bulk import', type: 'bool' },
    { key: 'whiteLabel', label: 'White‑label страници', type: 'bool' },
    { key: 'prioritySupport', label: 'Поддръжка (приоритетна)', type: 'bool' },
    { key: 'spotlightDays', label: 'Spotlight на начална (дни/месец)', type: 'value', formatter: v => v ? `${v}` : '—' },
];

export const PricingPage = () => {
    useEnsureCss();
    const fmt = useCurrency();
    const toast = useRef<Toast>(null);
    const [billing, setBilling] = useState<Billing>("monthly");
    const [contactOpen, setContactOpen] = useState(false);

    function priceOf(p: Plan) {
        if (p.priceMonthly === 0) return "Безплатно";
        if (billing === 'monthly') return `${fmt.format(p.priceMonthly)}`;
        const yearly = Math.round(p.priceMonthly * 12 * (1 - YEARLY_DISCOUNT));
        return `${fmt.format(yearly)} / год.`;
    }

    function perText() { return billing === 'monthly' ? "/ месец" : "(спестявате 17%)"; }

    function choose(plan: Plan) {
        if (plan.id === 'business') { setContactOpen(true); return; }
        toast.current?.show({ severity: 'success', summary: `Избран план: ${plan.name}`, detail: `Фактуриране: ${billing === 'monthly' ? 'месечно' : 'годишно'}`, life: 2200 });
    }

    const billingOptions = [
        { value: 'monthly' as Billing, label: 'Месечно' },
        { value: 'yearly' as Billing, label: 'Годишно' },
    ];

    return (
        <div>
            <Toast ref={toast} />

            <header className="header">
                <div className="container header-inner">
                    <div className="logo"><span className="dot" /> Acme Estates</div>
                    <div className="small">Цените са в EUR и включват ДДС.</div>
                </div>
            </header>

            <main className="container">
                <section className="hero">
                    <h1>Гъвкави планове за всеки етап на растеж</h1>
                    <p>Започнете със Starter, израствайте с Pro и мащабирайте с Business.</p>

                    <div className="toggle">
                        <SelectButton value={billing} onChange={(e) => setBilling(e.value)} options={billingOptions} optionLabel="label" itemTemplate={(opt) => <span>{opt.label}</span>} />
                        <span className="save-pill"><i className="pi pi-percentage" style={{ marginRight: 6 }} />Годишно: спестявате 17%</span>
                    </div>
                </section>

                <section className="grid" aria-label="Планове и цени">
                    {PLANS.map(plan => (
                        <Card key={plan.id} className="card" header={
                            <div className="plan-head">
                                <div className="plan-name">{plan.name}{plan.popular && <Tag className="badge-inline" value="Най‑популярен" severity="info" rounded />}</div>
                            </div>
                        }>
                            <div className="plan-card">
                                <div className="price-row">
                                    <div className="price">{priceOf(plan)}</div>
                                    <div className="per">{perText()}</div>
                                </div>
                                <Divider />
                                <ul className="features">
                                    {FEATURE_ROWS.map(row => {
                                        const raw = (plan as any)[row.key];
                                        const isIncluded = row.type === 'bool' ? !!raw : (raw !== undefined && raw !== null && raw !== 0 && raw !== "None" && raw !== "—");
                                        const text = row.formatter ? row.formatter(raw) : String(raw);
                                        return (
                                            <li key={String(row.key)}>
                                                <i className={`pi ${isIncluded ? 'pi-check-circle incl' : 'pi-times excl'}`} aria-hidden />
                                                <span>{row.label}{row.type === 'value' ? `: ${text}` : ''}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <Divider />
                                <div className="cta">
                                    <Button label={plan.id === 'business' ? 'Свържете се' : 'Избери план'} onClick={() => choose(plan)} icon={plan.id === 'business' ? 'pi pi-envelope' : 'pi pi-check-circle'} />
                                    <Button label="Започни с пробен период" link onClick={() => toast.current?.show({ severity: 'info', summary: 'Пробен период', detail: `Активиран за ${plan.name}`, life: 2000 })} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </section>

                <section className="table-wrap" aria-label="Сравнение на плановете">
                    <h3>Сравнение накратко</h3>
                    <DataTable value={[
                        { feature: "Обяви", starter: "5", pro: "25", business: "100" },
                        { feature: "Снимки на обява", starter: "20", pro: "40", business: "60" },
                        { feature: "Буустове / месец", starter: "1", pro: "4", business: "12" },
                        { feature: "AI асистент", starter: "100 съобщ./мес.", pro: "Неограничен", business: "Неогр. + Екип" },
                        { feature: "Поддръжка", starter: "Стандартна", pro: "Приоритетна", business: "Приоритетна" },
                        { feature: "API", starter: "Read", pro: "Full", business: "Full" },
                        { feature: "CRM експорт", starter: "Да", pro: "Да", business: "Да" },
                        { feature: "White‑label", starter: "—", pro: "Да", business: "Да" },
                    ]} stripedRows responsiveLayout="scroll" size="small">
                        <Column field="feature" header="Функция" frozen></Column>
                        <Column field="starter" header="Starter"></Column>
                        <Column field="pro" header="Pro"></Column>
                        <Column field="business" header="Business"></Column>
                    </DataTable>
                </section>

                <footer>© 2025 Acme Estates — ценоразпис</footer>
            </main>

            <Dialog header="Свържете се с екипа" visible={contactOpen} style={{ width: 'min(520px, 92vw)' }} modal onHide={() => setContactOpen(false)}>
                <p className="small">Оставете контакт и ще се свържем с вас за персонални условия и обемни отстъпки.</p>
                <div style={{ display: 'grid', gap: 10 }}>
                    <input className="p-inputtext p-component" placeholder="Име" />
                    <input className="p-inputtext p-component" placeholder="Имейл" />
                    <input className="p-inputtext p-component" placeholder="Телефон" />
                    <textarea className="p-inputtextarea p-inputtext" rows={4} placeholder="Какво ви е необходимо?"></textarea>
                    <Button label="Изпрати запитване" icon="pi pi-send" onClick={() => { setContactOpen(false); toast.current?.show({ severity: 'success', summary: 'Изпратено', life: 2000 }); }} />
                </div>
            </Dialog>
        </div>
    );
}
