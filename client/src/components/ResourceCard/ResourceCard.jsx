import { useState } from "react";
import "./ResourceCard.css";

const ResourceCard = ({ resource }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async (e) => {
        e.preventDefault();
        if (isDownloading) return;

        setIsDownloading(true);
        try {
            const response = await fetch(resource.fileUrl);
            if (!response.ok) throw new Error("Network response was not ok");

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = resource.fileName || "download";
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed, falling back to direct link", error);
            // Fallback: open in new tab if anything goes wrong
            window.open(resource.fileUrl, "_blank");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <article className="resource-card">
            <h3>{resource.title}</h3>

            <p>{resource.description}</p>

            <p>
                <strong>Category:</strong> {resource.category}
            </p>

            {resource.fileUrl && (
                <a
                    href={resource.fileUrl}
                    onClick={handleDownload}
                    style={{ cursor: isDownloading ? "wait" : "pointer" }}
                >
                    {isDownloading ? "Downloading..." : "Download Resource"}
                </a>
            )}
        </article>
    );
};

export default ResourceCard;