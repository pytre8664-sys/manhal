"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";

export default function ContactPage() {
  const { t } = useI18n();
  const toast = useToast();
  const [sent, setSent] = useState(false);

  return (
    <div className="container" style={{ maxWidth: 960, paddingBlock: 64 }}>
      <div className="section-head">
        <h1>{t("footer.contact")}</h1>
        <p>سؤال عن المنصة، مشكلة في حسابك، أو اقتراح؟ اكتب لنا وسنعود إليك.</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div className="card card--pad-lg">
          <form
            className="stack"
            style={{ gap: 14 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast(t("teacher.contactSent"), "success");
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="field">
              <label className="field__label">{t("auth.name")}</label>
              <input className="input" required />
            </div>
            <div className="field">
              <label className="field__label">{t("auth.email")}</label>
              <input className="input" type="email" required dir="ltr" />
            </div>
            <div className="field">
              <label className="field__label">الموضوع</label>
              <select className="select">
                <option>سؤال عام</option>
                <option>مشكلة تقنية</option>
                <option>توثيق حساب</option>
                <option>خصوصية البيانات</option>
                <option>شراكة أو تعاون</option>
              </select>
            </div>
            <div className="field">
              <label className="field__label">الرسالة</label>
              <textarea className="textarea" rows={5} required />
            </div>
            <button className="btn btn--block btn--lg" type="submit">
              {t("common.submit")}
            </button>
            {sent ? <p className="small muted center">تم استلام رسالتك بنجاح.</p> : null}
          </form>
        </div>

        <div className="stack" style={{ gap: 14 }}>
          {[
            ["mail", "البريد الإلكتروني", "hello@manhal.app", true],
            ["phone", "الهاتف", "+967 7XX XXX XXX", true],
            ["mapPin", "الموقع", "المكلا — حضرموت، اليمن", false],
          ].map(([icon, label, value, ltr]) => (
            <div className="card" key={label as string}>
              <div className="row" style={{ gap: 10 }}>
                <span className="role-card__icon" style={{ width: 40, height: 40, margin: 0 }}>
                  <Icon name={icon as string} />
                </span>
                <div>
                  <div className="tiny muted">{label as string}</div>
                  <strong className="small" dir={ltr ? "ltr" : undefined}>
                    {value as string}
                  </strong>
                </div>
              </div>
            </div>
          ))}
          <div className="alert alert--info">
            <Icon name="info" />
            <span>{t("common.demoNotice")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
