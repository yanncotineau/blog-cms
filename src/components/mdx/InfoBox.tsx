import { BookOpen, Zap, Code2, Database, Brain, AlertTriangle } from "lucide-react";

type InfoBoxVariant = "default" | "learning" | "quick" | "code" | "data" | "ai" | "warning";

interface InfoBoxProps {
  variant?: InfoBoxVariant;
  title: string;
  children: React.ReactNode;
}

const variantConfig: Record<InfoBoxVariant, {
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  textColor: string;
}> = {
  default: {
    icon: BookOpen,
    bg: "bg-slate-800/50",
    border: "border-slate-700",
    iconBg: "bg-slate-700",
    iconColor: "text-slate-300",
    titleColor: "text-slate-200",
    textColor: "text-slate-300",
  },
  learning: {
    icon: BookOpen,
    bg: "bg-blue-900/20",
    border: "border-blue-800",
    iconBg: "bg-blue-800",
    iconColor: "text-blue-300",
    titleColor: "text-blue-200",
    textColor: "text-blue-300",
  },
  quick: {
    icon: Zap,
    bg: "bg-amber-900/20",
    border: "border-amber-800",
    iconBg: "bg-amber-800",
    iconColor: "text-amber-300",
    titleColor: "text-amber-200",
    textColor: "text-amber-300",
  },
  code: {
    icon: Code2,
    bg: "bg-green-900/20",
    border: "border-green-800",
    iconBg: "bg-green-800",
    iconColor: "text-green-300",
    titleColor: "text-green-200",
    textColor: "text-green-300",
  },
  data: {
    icon: Database,
    bg: "bg-purple-900/20",
    border: "border-purple-800",
    iconBg: "bg-purple-800",
    iconColor: "text-purple-300",
    titleColor: "text-purple-200",
    textColor: "text-purple-300",
  },
  ai: {
    icon: Brain,
    bg: "bg-slate-800/50",
    border: "border-slate-700",
    iconBg: "bg-slate-700",
    iconColor: "text-slate-300",
    titleColor: "text-slate-200",
    textColor: "text-slate-300",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-900/20",
    border: "border-amber-800",
    iconBg: "bg-amber-800",
    iconColor: "text-amber-300",
    titleColor: "text-amber-200",
    textColor: "text-amber-300",
  },
};

export default function InfoBox({
  variant = "default",
  title,
  children,
}: InfoBoxProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={`my-6 overflow-hidden border-2 ${config.border} ${config.bg}`}>
      <div className={`flex items-center gap-3 border-b ${config.border} px-4 py-3`}>
        <div className={`${config.iconBg} p-2`}>
          <Icon className={`h-4 w-4 ${config.iconColor}`} />
        </div>
        <h4 className={`font-semibold ${config.titleColor}`}>{title}</h4>
      </div>
      <div className={`px-4 py-4 text-sm ${config.textColor} [&>p]:m-0 [&>ul]:my-2 [&>ul]:ml-4`}>
        {children}
      </div>
    </div>
  );
}
