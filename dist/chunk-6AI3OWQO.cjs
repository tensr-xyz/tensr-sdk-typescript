'use strict';

var React = require('react');
var DialogPrimitive = require('@radix-ui/react-dialog');
var lucideReact = require('lucide-react');
var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');
var jsxRuntime = require('react/jsx-runtime');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var DialogPrimitive__namespace = /*#__PURE__*/_interopNamespace(DialogPrimitive);

// src/components/dialog.tsx
function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
}
var Dialog = DialogPrimitive__namespace.Root;
var DialogTrigger = DialogPrimitive__namespace.Trigger;
var DialogPortal = DialogPrimitive__namespace.Portal;
var DialogClose = DialogPrimitive__namespace.Close;
var DialogOverlay = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive__namespace.Overlay.displayName;
var DialogContent = React__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntime.jsxs(
    DialogPrimitive__namespace.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsxs(DialogPrimitive__namespace.Close, { className: "absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive__namespace.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive__namespace.Title.displayName;
var DialogDescription = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive__namespace.Description.displayName;
var DataTable = ({
  data,
  columns,
  className,
  maxRows = 100
}) => {
  const displayData = maxRows ? data.slice(0, maxRows) : data;
  const tableColumns = columns || (data.length > 0 ? Object.keys(data[0]) : []);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("overflow-auto border rounded-md", className), children: [
    /* @__PURE__ */ jsxRuntime.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntime.jsx("thead", { className: "bg-muted", children: /* @__PURE__ */ jsxRuntime.jsx("tr", { children: tableColumns.map((column) => /* @__PURE__ */ jsxRuntime.jsx("th", { className: "px-4 py-2 text-left font-medium", children: column }, column)) }) }),
      /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: displayData.map((row, index) => /* @__PURE__ */ jsxRuntime.jsx("tr", { className: "border-t", children: tableColumns.map((column) => /* @__PURE__ */ jsxRuntime.jsx("td", { className: "px-4 py-2", children: String(row[column] || "") }, column)) }, index)) })
    ] }),
    maxRows && data.length > maxRows && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "px-4 py-2 text-sm text-muted-foreground bg-muted", children: [
      "Showing ",
      maxRows,
      " of ",
      data.length,
      " rows"
    ] })
  ] });
};
var Chart = ({
  data,
  type,
  title,
  className,
  width = 400,
  height = 300
}) => {
  const canvasRef = React__namespace.useRef(null);
  React__namespace.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    if (type === "bar" && data.datasets.length > 0) {
      const dataset = data.datasets[0];
      const barWidth = chartWidth / data.labels.length;
      const maxValue = Math.max(...dataset.data);
      dataset.data.forEach((value, index) => {
        const barHeight = value / maxValue * chartHeight;
        const x = padding + index * barWidth;
        const y = height - padding - barHeight;
        ctx.fillStyle = dataset.backgroundColor || "#3b82f6";
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      });
    }
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    data.labels.forEach((label, index) => {
      const x = padding + index * (chartWidth / data.labels.length) + chartWidth / data.labels.length / 2;
      ctx.fillText(label, x, height - padding + 20);
    });
  }, [data, type, width, height]);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col items-center", className), children: [
    title && /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-4", children: title }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "canvas",
      {
        ref: canvasRef,
        width,
        height,
        className: "border rounded"
      }
    )
  ] });
};

exports.Chart = Chart;
exports.DataTable = DataTable;
exports.Dialog = Dialog;
exports.DialogClose = DialogClose;
exports.DialogContent = DialogContent;
exports.DialogDescription = DialogDescription;
exports.DialogFooter = DialogFooter;
exports.DialogHeader = DialogHeader;
exports.DialogOverlay = DialogOverlay;
exports.DialogPortal = DialogPortal;
exports.DialogTitle = DialogTitle;
exports.DialogTrigger = DialogTrigger;
exports.cn = cn;
//# sourceMappingURL=chunk-6AI3OWQO.cjs.map
//# sourceMappingURL=chunk-6AI3OWQO.cjs.map