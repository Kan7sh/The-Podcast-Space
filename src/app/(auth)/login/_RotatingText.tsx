// components/TextCycle.tsx
import { cn } from "@/lib/utils";
import styles from "../../styles/RotatingText.module.css";

const texts = [
  "Record Podcasts",
  "Chat in Real-time",
  "High Quality Recordings",
];

export default function RotatingText() {
  return (
    <div className={styles.container}>
      {texts.map((text, index) => (
        <div
          key={index}
          className={cn(styles.textItem)}
          style={{ animationDelay: `${index * 3}s` }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}
