import { Box, Typography } from "@mui/material";
import "@core/basic-components/MultiFileUpload/MultiFileUpload.css";

type ProductGalleryProps = {
  images: string[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
};

export default function ProductGallery({
  images,
  onSelect,
  onRemove,
}: ProductGalleryProps) {
  if (!images.length) {
    return (
      <Box sx={{ mt: 2, p: 2, borderRadius: "12px", border: "1px dashed var(--border-color)" }}>
        <Typography color="text.secondary" variant="body2">
          No published photos yet. Upload on the Media tab above.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
        Published photos — click a tile to set as default
      </Typography>
      <div className="multi-upload__grid">
        {images.map((imageUrl, index) => (
          <div className="multi-upload__tile" key={imageUrl}>
            <button
              type="button"
              onClick={() => onSelect(imageUrl)}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label={`Set photo ${index + 1} as default`}
            >
              <img src={imageUrl} alt={`Product ${index + 1}`} />
            </button>
            <button
              type="button"
              className="multi-upload__remove"
              aria-label={`Remove photo ${index + 1}`}
              onClick={() => onRemove(imageUrl)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </Box>
  );
}
