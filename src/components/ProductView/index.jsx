import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/ProductList.module.scss";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function ProductViewComponet({role='user'}) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({ name: "", category: "", price: "" });
    const [editProduct, setEditProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.BASE_URL}/api/products`);
            setProducts(response.data?.data);
            setFilteredProducts(response.data?.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        const filtered = products.filter(
            (product) =>
                product.productName.toLowerCase().includes(newFilters.name.toLowerCase()) &&
                product.category.toLowerCase().includes(newFilters.category.toLowerCase()) &&
                (newFilters.price ? product.price <= newFilters.price : true)
        );
        setFilteredProducts(filtered);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.BASE_URL}/api/products/${id}`, { withCredentials: true });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleEditClick = (product) => {
        setEditProduct(product);
        setIsNew(false);
        setShowModal(true);
    };

    const handleAddClick = () => {
        setEditProduct({ name: "", price: "", category: "", detail: "" });
        setIsNew(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isNew) {
                await axios.post(`${process.env.BASE_URL}/api/products`,
                    { ...editProduct, price: Number(editProduct?.price) || 0, name: editProduct?.productName || '' },
                    { withCredentials: true }
                );
            } else {
                await axios.put(`${process.env.BASE_URL}/api/products/${editProduct.id}`,
                    { ...editProduct, price: Number(editProduct?.price) || 0, name: editProduct?.productName || '' },
                    { withCredentials: true });
            }
            fetchProducts();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Product List</h1>

            <div className={styles.topBar}>
                {role == 'admin' && <button className={styles.addButton} onClick={handleAddClick}>
                    <FaPlus /> Add Product
                </button>}
            </div>

            <div className={styles.filters}>
                <input type="text" name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} />
                <input type="text" name="category" placeholder="Filter by Category" value={filters.category} onChange={handleFilterChange} />
                <input type="number" name="price" placeholder="Max Price" value={filters.price} onChange={handleFilterChange} />
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Description</th>
                        {role == 'admin' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product._id}>
                            <td>{product.productName}</td>
                            <td>Rs. {product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.detail}</td>
                            {role == 'admin' && <td>
                                <FaEdit className={styles.editIcon} onClick={() => handleEditClick(product)} />
                                <FaTrash className={styles.deleteIcon} onClick={() => handleDelete(product.id)} />
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>{isNew ? "Add Product" : "Edit Product"}</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Product Name" value={editProduct.productName} onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })} required />
                            <input type="number" placeholder="Price" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} required />
                            <input type="text" placeholder="Category" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} required />
                            <textarea placeholder="Description" value={editProduct.detail} onChange={(e) => setEditProduct({ ...editProduct, detail: e.target.value })} />
                            <button type="submit">{isNew ? "Add Product" : "Save Changes"}</button>
                            <button type="button" className={styles.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}