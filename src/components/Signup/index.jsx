import { useState } from "react";
import axios from 'axios';
import styles from "../../styles/Auth.module.scss";
import { encodeString } from "@/utils/auth";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUpComponent() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        role: "user", // Default role
    });
    const [errors, setErrors] = useState({});
    const [isUserAlreadyExist, setIsUserAlreadyExist] = useState(false);

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const encodedPassword = encodeString(formData.password);
            const payload = {
                firstname: formData.firstName,
                lastname: formData.lastName,
                username: formData.username,
                password: encodedPassword,
                role: formData.role, // Include selected role
            };

            try {
                const response = await axios.post(`${process.env.BASE_URL}/api/auth/register`, payload, {
                    withCredentials: true,
                });
                if (response?.data?.data == -1) setIsUserAlreadyExist(true);
                else if (response?.data?.data == 1) {
                    router.push({
                        pathname: '/',
                        query: router?.query ?? {}
                    });
                }
            } catch (error) {
                console.error("handleSubmit", error);
            }
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.heading}>Sign Up</h1>
                <div className={styles.field}>
                    <label>First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                </div>
                <div className={styles.field}>
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                    <label>Username *</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    {errors.username && <span className={styles.error}>{errors.username}</span>}
                </div>
                <div className={styles.field}>
                    <label>Password *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <span className={styles.error}>{errors.password}</span>}
                </div>

                {/* Role Selection Radio Buttons */}
                <div className={styles.field}>
                    <label>Role *</label>
                    <div className={styles.radio_group}>
                        <label className={styles.radio_option}>
                            <input
                                type="radio"
                                name="role"
                                value="user"
                                checked={formData.role === "user"}
                                onChange={handleChange}
                            />
                            User
                        </label>
                        <label className={styles.radio_option}>
                            <input
                                type="radio"
                                name="role"
                                value="admin"
                                checked={formData.role === "admin"}
                                onChange={handleChange}
                            />
                            Admin
                        </label>
                    </div>
                </div>

                <button type="submit" className={styles.button}>Sign Up</button>
                {isUserAlreadyExist && <div className={styles.field}><span className={styles.error}>Username Already Exists</span></div>}
                <Link className={styles.link_tag} href={{ pathname: "/signup", query: router?.query ?? {} }}>Login</Link>
            </form>
        </div>
    );
}