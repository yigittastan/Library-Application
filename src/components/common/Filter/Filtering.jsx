import React from "react";

export default function Filtering({ onFilterChange }) {
    return (
        <div className="dropdown mb-3">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Filtrele
            </button>
            <ul className="dropdown-menu">
                <li>
                    <button className="dropdown-item" onClick={() => onFilterChange("Korku")}>
                        Korku
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => onFilterChange("Bilim Kurgu")}>
                        Bilim Kurgu
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => onFilterChange("Aksiyon")}>
                        Aksiyon
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => onFilterChange("Yazar")}>
                        Yazar
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => onFilterChange("Dil")}>
                        Dil
                    </button>
                </li>
            </ul>
        </div>
    );
}
