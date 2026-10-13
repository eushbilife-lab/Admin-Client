import { Box, Card, CardMedia, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type ProductGalleryProps = {
  images: string[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
};

export default function ProductGallery({ images, onSelect, onRemove }: ProductGalleryProps) {
  if (!images.length) return null;
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mt: 2 }}>
      {images.map((imageUrl, index) => (
        <Box key={imageUrl} sx={{ position: "relative" }}>
          <Tooltip title="Make this the default image">
            <Card sx={{ width: 160, cursor: "pointer" }} onClick={() => onSelect(imageUrl)}>
              <CardMedia
                component="img"
                image={imageUrl}
                alt={`Product image ${index + 1}`}
                sx={{ height: 180, objectFit: "cover" }}
              />
            </Card>
          </Tooltip>
          <IconButton
            aria-label="Remove image"
            sx={{ position: "absolute", top: -8, right: -8, bgcolor: "background.paper" }}
            onClick={() => onRemove(imageUrl)}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
