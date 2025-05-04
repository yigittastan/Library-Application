import React from "react";

export default function Search({ searchTerm, setSearchTerm, onSearch }) {
    return (
        <form className="form-inline mb-3 d-flex" onSubmit={onSearch}>
            <input
                className="form-control me-2"
                type="search"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Ürün ara"
            />
            <button className="btn btn-outline-success" type="submit">
                Ara
            </button>
        </form>
    );
}
