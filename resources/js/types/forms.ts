export type FormErrors = Record<string, string>;

export type FormState<T extends Record<string, unknown>> = {
    data: T;
    errors: FormErrors;
    processing: boolean;
    status: string | null;
    formError: string | null;
    hasErrors: boolean;
    setField: <K extends keyof T>(key: K, value: T[K]) => void;
    clearErrors: () => void;
    reset: (...fields: Array<keyof T>) => void;
    setStatus: (value: string | null) => void;
    setFormError: (value: string | null) => void;
    submit: (
        action: (formData: T) => Promise<void | string | null>,
    ) => Promise<void>;
};
