import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import clsx from "classnames";

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.add(savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className={clsx(
                "p-2 rounded-full border focus:outline-none focus:ring",
                theme === "light" ? "text-yellow-500 border-yellow-500" : "text-blue-500 border-blue-500"
            )}
            aria-label="Toggle theme"
        >
            {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
    );
}
