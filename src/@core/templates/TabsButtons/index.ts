export { default } from "./TabsButtons";

interface Tab {
  label: string;
  element: JSX.Element;
}

export interface TabsProps {
  tabs: Tab[];
  value: number;
  showRefresh?: boolean;
  onRefresh?: () => void;
  onChange: (tab: number) => void;
  btn?: boolean;
  btnTitle?: string;
  onBtnClick?: () => void;
}

export interface TabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}
