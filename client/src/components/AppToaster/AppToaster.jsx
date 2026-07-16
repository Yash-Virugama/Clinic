import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

const AppToaster = () => {
    const [position, setPosition] = useState("top-center");
    const [top, setTop] = useState("16px");

    useEffect(() => {
        const updateToaster = () => {
            if (window.innerWidth >= 640) {
                setPosition("top-right");
                setTop("88px"); // Admin header height
            } else {
                setPosition("top-center");
                setTop("16px");
            }
        };

        updateToaster();

        window.addEventListener("resize", updateToaster);
        return () => window.removeEventListener("resize", updateToaster);
    }, []);

    return (

        <Toaster
            position={position}
            gutter={8}
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#f8fafc",
                    color: "#0f172a",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "12px 18px",
                    boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: "500",
                },
                success: {
                    style: {
                        borderLeft: "4px solid var(--primary, #2563eb)",
                    },
                    iconTheme: {
                        primary: "var(--primary, #2563eb)",
                        secondary: "#ffffff",
                    },
                },
                error: {
                    style: {
                        borderLeft: "4px solid #ef4444",
                    },
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                    },
                },
            }}
        />
    );
}

export default AppToaster;