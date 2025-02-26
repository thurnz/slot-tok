"use client";

import { SlotMachine } from "@/components/SlotMachine";
import { Video } from "@/components/Video";
import styles from "./page.module.css";
import { useRef } from "react";

export default function Home() {
  const ref = useRef<Video>(null);

  const handleSpin = () => {
    ref.current?.next();
  };

  return (
    <div className={styles.page}>
      <SlotMachine onSpin={handleSpin} />
      <Video ref={ref} />
    </div>
  );
}
