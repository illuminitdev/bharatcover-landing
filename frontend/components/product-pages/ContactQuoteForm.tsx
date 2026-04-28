'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import type { ContactFormField, ContactInterestOption, ContactPageData } from '@/types/product-page';
import styles from './ContactPage.module.css';

function renderField(f: ContactFormField, value: string, onChange: (id: string, v: string) => void) {
  const common = {
    id: f.id,
    name: f.id,
    placeholder: f.placeholder,
    required: f.required,
    maxLength: f.maxLength,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(f.id, e.target.value),
  };

  if (f.type === 'textarea') {
    return <textarea {...common} />;
  }
  if (f.type === 'select') {
    return (
      <select {...common}>
        {(f.options ?? []).map((o, i) => {
          if (typeof o === 'string') {
            return (
              <option key={i} value={o}>
                {o || 'Select'}
              </option>
            );
          }
          return (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </select>
    );
  }
  return <input type={f.type} {...common} />;
}

type Props = {
  form: ContactPageData['form'];
};

export function ContactQuoteForm({ form }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    form.rows.flat().forEach((f) => {
      init[f.id] = '';
    });
    return init;
  });
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  const onChange = useCallback((id: string, v: string) => {
    setValues((prev) => ({ ...prev, [id]: v }));
  }, []);

  function toggleInterest(id: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit() {
    const name = values.cName?.trim() ?? '';
    const phone = (values.cPhone ?? '').trim();
    if (!name) return;
    if (!/^[6-9]\d{9}$/.test(phone)) {
      window.alert('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <div className={styles.formCard}>
        <h2>{form.title}</h2>
        <p className={styles.sub}>{form.subtitle}</p>

        {form.rows.map((row, ri) => (
          <div key={ri} className={`${styles.formRow} ${row.length === 1 ? styles.formRowFull : ''}`}>
            {row.map((f) => (
              <div key={f.id} className={styles.field}>
                <label htmlFor={f.id}>
                  {f.label}
                  {f.required ? <span className={styles.req}> *</span> : null}
                </label>
                {renderField(f, values[f.id] ?? '', onChange)}
              </div>
            ))}
          </div>
        ))}

        <div className={`${styles.formRow} ${styles.formRowFull}`} style={{ marginBottom: 10 }}>
          <div className={styles.field}>
            <label>
              {form.interests.label}
              <span className={styles.req}> *</span>
            </label>
          </div>
        </div>
        <div className={styles.interestGrid}>
          {form.interests.options.map((opt: ContactInterestOption) => {
            const selected = interests.has(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                className={`${styles.intOpt} ${selected ? styles.intOptSelected : ''}`}
                onClick={() => toggleInterest(opt.id)}
              >
                <span className={styles.intCheck}>{selected ? '✓' : ''}</span>
                {opt.label}
              </button>
            );
          })}
        </div>

        <button type="button" className={styles.submitBtn} onClick={submit}>
          {form.submitLabel}
        </button>
        <p className={styles.formPrivacy}>{form.privacyNote}</p>
      </div>

      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} role="dialog" aria-modal="true">
        <div className={styles.successBox}>
          <div className={styles.successTick}>🎉</div>
          <h2>Thank You!</h2>
          <p>
            We&apos;ve received your enquiry. A BharatCover advisor will call you back within{' '}
            <strong>2 business hours</strong>.
            <br />
            <br />
            Check your WhatsApp/email for a confirmation.
          </p>
          <Link href="/">← Back to Home</Link>
        </div>
      </div>
    </>
  );
}
