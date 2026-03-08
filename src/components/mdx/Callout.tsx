import { AlertCircle, Info, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";

type CalloutType = "info" | "warning" | "tip" | "danger" | "success";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const typeConfig: Record<CalloutType, {
  icon: React.ComponentType<{ className?: string }>;
  borderColor: string;
  bgColor: string;
  textColor: string;
  titleColor: string;
  iconColor: string;
}> = {
  info: {
    icon: Info,
    borderColor: "border-blue-500",
    bgColor: "bg-blue-950/50",
    textColor: "text-blue-200",
    titleColor: "text-blue-200",
    iconColor: "text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-amber-500",
    bgColor: "bg-amber-950/50",
    textColor: "text-amber-200",
    titleColor: "text-amber-200",
    iconColor: "text-amber-400",
  },
  tip: {
    icon: Lightbulb,
    borderColor: "border-green-500",
    bgColor: "bg-green-950/50",
    textColor: "text-green-200",
    titleColor: "text-green-200",
    iconColor: "text-green-400",
  },
  danger: {
    icon: AlertCircle,
    borderColor: "border-red-500",
    bgColor: "bg-red-950/50",
    textColor: "text-red-200",
    titleColor: "text-red-200",
    iconColor: "text-red-400",
  },
  success: {
    icon: CheckCircle,
    borderColor: "border-emerald-500",
    bgColor: "bg-emerald-950/50",
    textColor: "text-emerald-200",
    titleColor: "text-emerald-200",
    iconColor: "text-emerald-400",
  },
};

export default function Callout({
  type = "info",
  title,
  children,
}: CalloutProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`my-4 border-2 border-white border-l-4 ${config.bgColor} ${config.borderColor} px-4 pt-2 pb-3 transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0_0_#fff]`}
    >
      {title && (
        <div className="flex items-center gap-2.5 mb-0.5">
          <Icon className={`h-5 w-5 shrink-0 ${config.iconColor}`} />
          <p className={`font-semibold leading-tight ${config.titleColor}`}>{title}</p>
        </div>
      )}
      {!title && (
        <div className="flex items-start gap-2.5">
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`} />
          <div className={`text-sm ${config.textColor} [&>p]:m-0 min-w-0 flex-1`}>
            {children}
          </div>
        </div>
      )}
      {title && (
        <div className={`text-sm ${config.textColor} [&>p]:m-0 pl-[1.875rem]`}>
          {children}
        </div>
      )}
    </div>
  );
}
