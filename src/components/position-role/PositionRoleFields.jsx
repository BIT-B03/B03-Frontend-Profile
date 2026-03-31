import React, { useEffect, useRef, useState } from 'react';
import PositionRolePhotoField from './PositionRolePhotoField';

const generationIcon = '/svg/icon-generation.svg';
const roleIcon = '/svg/icon-role.svg';
const positionIcon = '/svg/icon-position.svg';
const chevronDownIcon = '/svg/icon-chevron-down.svg';

function SelectField({ id, label, iconSrc, value, onChange, options = [], required, disabled }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = options.find((opt) => opt === value) || options[0] || '';

    return (
        <div className="flex flex-col gap-2.5" ref={wrapperRef}>
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-pure-white tracking-wide">
                {iconSrc && (
                    <img src={iconSrc} alt="" aria-hidden="true" className="w-4 h-4 mt-0.5" />
                )}
                <span>{label}</span>
                {required && <span className="text-brand-24e1c9 text-xs">*</span>}
            </label>
            <div className="relative">
                <button
                    id={id}
                    type="button"
                    onClick={() => !disabled && setOpen((prev) => !prev)}
                    disabled={disabled}
                    className={`w-full text-left rounded-2xl glass border transition-all duration-300 px-4 py-3.5 text-sm sm:text-base text-pure-white placeholder:text-muted-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9/50 focus:border-brand-24e1c9 focus:bg-brand-fill/80 hover:border-brand-24e1c9/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl shadow-lg shadow-black/10 flex items-center justify-between gap-3 ${open ? 'border-brand-24e1c9' : ''}`}
                >
                    <span className="truncate">{selected}</span>
                    <span className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                        <img src={chevronDownIcon} alt="" aria-hidden="true" className="w-4 h-4 opacity-80" />
                    </span>
                </button>
                {open && (
                    <div className="absolute z-20 mt-2 w-full rounded-2xl glass border border-brand-24e1c9/40 bg-dark-bg/95 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden">
                        <ul className="max-h-64 overflow-y-auto pr-1 scrollbar-hidden">
                            {options.map((opt) => (
                                <li key={opt}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(opt);
                                            setOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3.5 text-sm sm:text-base transition-colors duration-150 ${opt === selected ? 'bg-brand-fill/60 text-pure-white' : 'text-pure-white hover:bg-brand-fill/40'}`}
                                    >
                                        {opt}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function NumberField({ id, label, iconSrc, value, onChange, min = 1, max, required, disabled }) {
    return (
        <div className="flex flex-col gap-2.5">
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-pure-white tracking-wide">
                {iconSrc && (
                    <img src={iconSrc} alt="" aria-hidden="true" className="w-4 h-4 mt-0.5" />
                )}
                <span>{label}</span>
                {required && <span className="text-brand-24e1c9 text-xs">*</span>}
            </label>
            <div className="relative group">
                <input
                    id={id}
                    type="number"
                    min={min}
                    max={max}
                    value={value ?? ''}
                    onChange={(e) => {
                        const v = e.target.value === '' ? '' : Number(e.target.value);
                        onChange(v);
                    }}
                    disabled={disabled}
                    placeholder="Enter number..."
                    className="w-full appearance-none rounded-2xl glass border transition-all duration-300 px-4 py-3.5 text-sm sm:text-base text-pure-white placeholder:text-muted-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-24e1c9/50 focus:border-brand-24e1c9 focus:bg-brand-fill/80 hover:border-brand-24e1c9/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl shadow-lg shadow-black/10"
                />
            </div>
        </div>
    );
}

export default function PositionRoleFields({
    formState,
    onChange,
    photoSrc,
    photoAlt,
    photoPlaceholderLetter,
    photoDisabled,
    photoIsUploading,
    photoError,
    photoSuccessMessage,
    onPickPhoto,
    onDeletePhoto,
    roleOptions = [],
    positionOptions = [],
    disabled,
}) {
    const defaultRoleOptions = [
        'user',
        'admin',
    ];
    const defaultPositionOptions = [
        'Members',
        'Coordinator',
        'Co-coordinator',
        'Mentor',
    ];

    const baseRoleOpts = roleOptions && roleOptions.length ? roleOptions : defaultRoleOptions;

    const roleOpts = baseRoleOpts;
    const positionOpts = positionOptions && positionOptions.length ? positionOptions : defaultPositionOptions;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {onPickPhoto && (
                <PositionRolePhotoField
                    src={photoSrc}
                    alt={photoAlt}
                    placeholderLetter={photoPlaceholderLetter}
                    disabled={photoDisabled ?? disabled}
                    isUploading={photoIsUploading}
                    error={photoError}
                    successMessage={photoSuccessMessage}
                    onPickFile={onPickPhoto}
                    onDeleteFile={onDeletePhoto}
                />
            )}
            <NumberField
                id="position-role-generation"
                label="Generation"
                iconSrc={generationIcon}
                value={formState.generation}
                onChange={(val) => onChange('generation', val)}
                min={1}
                max={100}
                disabled={disabled}
            />
            <SelectField
                id="position-role-role"
                label="Role"
                iconSrc={roleIcon}
                value={formState.role}
                onChange={(val) => onChange('role', val)}
                options={roleOpts}
                disabled={disabled}
            />
            <div className="sm:col-span-2">
                <SelectField
                    id="position-role-position"
                    label="Position"
                    iconSrc={positionIcon}
                    value={formState.position}
                    onChange={(val) => onChange('position', val)}
                    options={positionOpts}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
