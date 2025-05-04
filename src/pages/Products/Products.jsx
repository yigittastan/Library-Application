import React, { useState, useEffect } from "react";
import Search from "../../components/common/Search/Search";
import Filtering from "../../components/common/Filter/Filtering";
import SortBy from "../../components/common/SortBy/SortBy";
import Slider from "./Slider";
import axiosInstance from "../../api/axiosInstance";

export default function Products() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get("/products"); // baseURL + /products
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError("Ürünler yüklenirken bir hata oluştu.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        // Arama, filtreleme ve sıralama işlemlerini uygula
        let result = [...products];

        // Arama filtresi
        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Kategori filtresi
        if (selectedFilter) {
            result = result.filter(product =>
                product.category === selectedFilter
            );
        }

        // Sıralama
        if (sortOption === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredProducts(result);
    }, [searchTerm, selectedFilter, sortOption, products]);

    // Arama işlemi
    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Arama yapıldı:", searchTerm);
        // Arama işlemi useEffect içinde gerçekleşiyor
    };

    // Filtre değişimi
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        console.log("Filtre seçildi:", filter);
    };

    // Sıralama değişimi
    const handleSortChange = (option) => {
        setSortOption(option);
        console.log("Sıralama seçildi:", option);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Ürünler</h1>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Arama bileşeni */}
                <div className="md:col-span-1">
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onSearch={handleSearch}
                    />
                </div>

                {/* Filtreleme bileşeni */}
                <div className="md:col-span-1">
                    <Filtering
                        selectedFilter={selectedFilter}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Sıralama bileşeni */}
                <div className="md:col-span-1">
                    <SortBy
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                    />
                </div>
            </div>

            {/* Slider bileşeni */}
            <div className="mb-8">
                <Slider />
            </div>

            {/* Ürün listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div
                            key={product.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-gray-600">Kategori: {product.category}</p>
                            <p className="text-lg font-bold mt-2">{product.price} ₺</p>
                            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                Sepete Ekle
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">Ürün bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
}