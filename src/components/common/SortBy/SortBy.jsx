import React from "react";

export default function ShortBy({ onSortChange }) {
    return (
        <div className="dropdown mb-4">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
            >
                Sırala
            </button>
            <ul className="dropdown-menu">
                <li>
                    <button className="dropdown-item" onClick={() => onSortChange("asc")}>
                        En Düşük Fiyat
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => onSortChange("desc")}>
                        En Yüksek Fiyat
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => onSortChange("bestseller")}>
                        Çok Satanlar
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => onSortChange("newest")}>
                        En Yeniler
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => onSortChange("alphabetical")}>
                        Alfabetik
                    </button>
                </li>
            </ul>
        </div>
    );
}
