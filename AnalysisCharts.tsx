  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";

interface RegionData {
  name: string;
  score: number;
}

interface AnalysisChartsProps {
  regions: {
    upper_face: { severity_score: number };
    mid_face: { severity_score: number };
    lower_face: { severity_score: number };
    jawline_neck: { severity_score: number };
  };
  skinHealthScore: number;
  agingIndicators: {
    texture_tone: string[];
    volume_laxity: string[];
    dynamic_wrinkles: string[];
  };
  ageGroup: string;
  relativePosition: string;
  language?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const getRegionLabels = (language: string = "fa") => {
  if (language === "ar") return ["الوجه العلوي", "منتصف الوجه", "الوجه السفلي", "الفك والرقبة"];
  if (language === "en") return ["Upper Face", "Mid Face", "Lower Face", "Jawline & Neck"];
  return ["نیمه فوقانی", "نیمه میانی", "نیمه تحتانی", "فک و گردن"];
};

const getAgingLabels = (language: string = "fa") => {
  if (language === "ar") return ["الملمس والنبرة", "الحجم والترهل", "التجاعيد الديناميكية"];
  if (language === "en") return ["Texture & Tone", "Volume & Laxity", "Dynamic Wrinkles"];
  return ["تکسچر و تن", "حجم و شلی", "چروک‌های دینامیک"];
};

const getLeaderboardLabels = (language: string = "fa") => {
  if (language === "ar") return { best: "الأفضل", high: "عالي", you: "أنت", average: "متوسط", low: "منخفض" };
  if (language === "en") return { best: "Best", high: "High", you: "You", average: "Average", low: "Low" };
  return { best: "بهترین", high: "بالا", you: "شما", average: "متوسط", low: "پایین" };
};

export function RegionSeverityChart({ regions, language = "fa" }: { regions: AnalysisChartsProps["regions"]; language?: string }) {
  const labels = getRegionLabels(language);
  const data: RegionData[] = [
    { name: labels[0], score: regions.upper_face.severity_score },
    { name: labels[1], score: regions.mid_face.severity_score },
    { name: labels[2], score: regions.lower_face.severity_score },
    { name: labels[3], score: regions.jawline_neck.severity_score },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />