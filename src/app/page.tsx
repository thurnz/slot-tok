"use client";

import { SlotMachine } from "@/components/SlotMachine";
import { Video, VideoHandle } from "@/components/Video";
import styles from "./page.module.css";
import { useRef } from "react";

export default function Home() {
  const ref = useRef<VideoHandle>(null);

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
