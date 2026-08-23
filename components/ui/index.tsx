'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

/* ---------------------------------------------------------------- Button -- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'emergency';
type ButtonSize = 'sm' | 'md' | 'lg';

const buttonBase =
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors ' +
    'disabled:opacity-50 disabled:pointer-events-none select-none';

const buttonVariants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700',
    secondary: 'bg-surface text-ink border border-line-strong hover:bg-canvas active:bg-brand-50',
    ghost: 'text-ink-2 hover:bg-canvas active:bg-line/60',
    emergency: 'bg-emergency-500 text-white hover:bg-emergency-600',
};

// Every size clears the 44px minimum touch target.
const buttonSizes: Record<ButtonSize, string> = {
    sm: 'h-11 px-4 text-sm rounded-[10px]',
    md: 'h-12 px-5 text-[15px] rounded-[12px]',
    lg: 'h-14 px-6 text-base rounded-[14px]',
};

interface ButtonProps extends ComponentProps<'button'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={cn(
                buttonBase,
                buttonVariants[variant],
                buttonSizes[size],
                fullWidth && 'w-full',
                className
            )}
        >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {children}
        </button>
    );
}

export function ButtonLink({
    href,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    children,
}: {
    href: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className={cn(
                buttonBase,
                buttonVariants[variant],
                buttonSizes[size],
                fullWidth && 'w-full',
                className
            )}
        >
            {children}
        </Link>
    );
}

/* ------------------------------------------------------------------ Card -- */

export function Card({
    className,
    children,
    ...props
}: ComponentProps<'div'>) {
    return (
        <div
            {...props}
            className={cn(
                'bg-surface border border-line rounded-[16px]',
                className
            )}
        >
            {children}
        </div>
    );
}

/* ----------------------------------------------------------------- Field -- */

interface FieldProps {
    label: string;
    htmlFor?: string;
    hint?: string;
    error?: string;
    children: ReactNode;
    className?: string;
}

/** Label always sits above the control, never as a placeholder. */
export function Field({ label, htmlFor, hint, error, children, className }: FieldProps) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink-2">
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-sm text-danger-500">{error}</p>
            ) : hint ? (
                <p className="text-sm text-ink-3">{hint}</p>
            ) : null}
        </div>
    );
}

export const inputStyles =
    'w-full h-12 px-4 rounded-[12px] bg-surface border border-line-strong text-ink ' +
    'placeholder:text-ink-4 transition-colors focus:border-brand-500 outline-none';

export function Input({ className, ...props }: ComponentProps<'input'>) {
    return <input {...props} className={cn(inputStyles, className)} />;
}

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
    return (
        <select {...props} className={cn(inputStyles, 'pr-10', className)}>
            {children}
        </select>
    );
}

/* ------------------------------------------------------------------ Chip -- */

export function Chip({
    active = false,
    className,
    children,
    ...props
}: ComponentProps<'button'> & { active?: boolean }) {
    return (
        <button
            {...props}
            aria-pressed={active}
            className={cn(
                'h-10 shrink-0 px-4 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap',
                active
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-surface text-ink-2 border-line-strong hover:border-brand-300 hover:text-brand-600',
                className
            )}
        >
            {children}
        </button>
    );
}

/* ------------------------------------------------------------------ Tag --- */

const tagTones = {
    neutral: 'bg-canvas text-ink-3 border-line',
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    success: 'bg-success-100 text-success-500 border-success-100',
    warning: 'bg-warning-100 text-warning-500 border-warning-100',
    danger: 'bg-danger-100 text-danger-500 border-danger-100',
} as const;

export function Tag({
    tone = 'neutral',
    className,
    children,
}: {
    tone?: keyof typeof tagTones;
    className?: string;
    children: ReactNode;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 h-6 px-2 rounded-full border text-xs font-semibold',
                tagTones[tone],
                className
            )}
        >
            {children}
        </span>
    );
}

/* ----------------------------------------------------------- Empty state -- */

export function EmptyState({
    icon,
    title,
    body,
    action,
}: {
    icon?: ReactNode;
    title: string;
    body?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center text-center py-14 px-6">
            {icon && (
                <div className="mb-4 grid place-items-center size-14 rounded-full bg-brand-50 text-brand-500">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            {body && <p className="mt-1.5 text-ink-3 max-w-sm">{body}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

/* -------------------------------------------------------------- Skeleton -- */

/** Shapes mirror the real content so nothing jumps when data lands. */
export function Skeleton({ className }: { className?: string }) {
    return <div className={cn('animate-pulse rounded-[10px] bg-line/70', className)} />;
}

/* --------------------------------------------------------------- Section -- */

export function SectionHeader({
    title,
    action,
    className,
}: {
    title: string;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex items-baseline justify-between gap-4 mb-3', className)}>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            {action}
        </div>
    );
}
