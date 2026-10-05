interface HeadingProps {
    size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    children: React.ReactNode;
    className?: string;
  }
  
  export default function Heading({ size, children, className = "" }: HeadingProps) {
    const Tag = size;
    return <Tag className={className}>{children}</Tag>;
  }
  