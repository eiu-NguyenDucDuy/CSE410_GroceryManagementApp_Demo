import { useState, type ChangeEvent, type FormEvent } from "react";

interface SearchBarProps {
    onSearch: (keyword: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    onSearch,
    placeholder = "Search...",
}: SearchBarProps) {
    const [localInput, setLocalInput] = useState<string>("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(localInput);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="d-flex gap-2 align-items-center search-bar-container"
        >
            <input
                type="text"
                value={localInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setLocalInput(e.target.value)
                }
                placeholder={placeholder}
                className="form-control search-input"
            />
            <button
                type="submit"
                className="btn btn-outline-secondary"
                aria-label="Search"
            >
                <i className="fas fa-search"></i>
            </button>
        </form>
    );
}
