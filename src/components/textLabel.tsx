interface TextLabelProps {
  text: string;
  fontSize:
    | "HeroTitle-60"
    | "Text-20"
    | "Text-18"
    | "Text-14"
    | "Text-12"
    | "Titles-36"
    | "Titles-30"
    | "Title-Light";
  color:
    | "Green"
    | "Yellow"
    | "White"
    | "Gray-100"
    | "Gray-200"
    | "Gray-600"
    | "Gray-800"
    | "Gray-900";
}

const fontSizeClasses = {
  "HeroTitle-60": "text-6xl font-montserrat font-bold",
  "Text-20": "text-xl font-lato font-normal",
  "Text-18": "text-lg font-lato font-normal",
  "Text-14": "text-lg font-lato font-normal",
  "Text-12": "text-sm font-lato font-normal",
  "Titles-36": "text-4xl font-montserrat font-bold",
  "Titles-30": "text-3xl font-montserrat font-bold",
  "Title-Light": "text-4xl font-montserrat font-light",
};

const colorClasses = {
  Green: "text-simmpy-green",
  Yellow: "text-simmpy-yellow",
  White: "text-white",
  "Gray-100": "text-simmpy-gray-100",
  "Gray-200": "text-simmpy-gray-200",
  "Gray-600": "text-simmpy-gray-600",
  "Gray-800": "text-simmpy-gray-800",
  "Gray-900": "text-simmpy-gray-900",
};

export function TextLabel({ text, fontSize, color }: TextLabelProps) {
  return (
    <p
      className={`flex w-auto antialiased ${fontSizeClasses[fontSize]} ${colorClasses[color]}`}
    >
      {text}
    </p>
  );
}
