"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

const baseCls =
  "w-full rounded border border-border bg-surface px-3 py-2 text-sm text-txt outline-none " +
  "transition-colors duration-150 placeholder:text-txt-muted " +
  "focus:border-primary disabled:cursor-not-allowed disabled:bg-app-bg disabled:text-txt-muted";

interface WrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

function Wrapper({ label, error, required, children }: WrapperProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-txt-secondary">
          {label}
          {required && <span className="mr-0.5 text-state-danger">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-[11px] text-state-danger">{error}</p>}
    </div>
  );
}

/* ─── Input ─── */
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function InputField({ label, error, className = "", ...rest }: InputFieldProps) {
  return (
    <Wrapper label={label} error={error} required={rest.required}>
      <input
        {...rest}
        className={`${baseCls} ${error ? "border-state-danger" : ""} ${className}`}
      />
    </Wrapper>
  );
}

/* ─── Select ─── */
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function SelectField({ label, error, children, className = "", ...rest }: SelectFieldProps) {
  return (
    <Wrapper label={label} error={error} required={rest.required}>
      <select
        {...rest}
        className={`${baseCls} ${error ? "border-state-danger" : ""} ${className}`}
      >
        {children}
      </select>
    </Wrapper>
  );
}

/* ─── Textarea ─── */
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextareaField({ label, error, className = "", ...rest }: TextareaFieldProps) {
  return (
    <Wrapper label={label} error={error} required={rest.required}>
      <textarea
        {...rest}
        className={`${baseCls} resize-none ${error ? "border-state-danger" : ""} ${className}`}
      />
    </Wrapper>
  );
}
