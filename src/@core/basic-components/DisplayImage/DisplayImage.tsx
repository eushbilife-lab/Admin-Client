import { DisplayImageProps } from ".";
import profileStyles from "./DisplayImage.module.css";

export default function DisplayImage({
  src,
  alt,
  onLoad,
  imageMainStyle = {},
}: DisplayImageProps) {
  return (
    <div className={profileStyles.imageMain} style={imageMainStyle}>
      <div className={profileStyles.imageInner}>
        <img src={src} onLoad={onLoad} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}
