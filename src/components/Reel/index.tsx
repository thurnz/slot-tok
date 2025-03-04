import { FC, useState, useRef, useEffect, useMemo } from "react";
import { useTick, extend, useApplication } from "@pixi/react";
import { Texture, Sprite, Ticker, Container } from "pixi.js";
import { easeInOutSine } from "@/utils/ease";

extend({ Sprite, Container });

export interface ReelProps {
  id: number;
  item: number;
  duration: number;
  texture: Texture | undefined;
  width: number;
  onFinish: () => void;
};

export const Reel: FC<ReelProps> = ({ id, item, duration, texture, width, onFinish }) => {
  const [y, setY] = useState(0);
  const ticker = Ticker.shared;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { app } = useApplication();
  const deltaRef = useRef(0);
  const totalItems = 9;
  const itemHeightRef = useRef(0);
  const distanceRef = useRef(0);
  const targetYRef = useRef(0);

  const centerY = useMemo(() => {
    return ((app.renderer?.screen.height || 0) - itemHeightRef.current) / 2;
  }, [app.renderer]);

  useEffect(() => {
    if(!texture?.frame) return;
    const w = width || size.width;
    setSize({ width: w, height: w / texture.frame.width * texture.frame.height });
  }, [size.width, texture?.frame, width]);

  useEffect(() => {
    if(size.height){
      itemHeightRef.current = size.height / totalItems;
      targetYRef.current = centerY - itemHeightRef.current * Math.floor(9 + Math.random() * totalItems);
    }
  }, [centerY, item, size.height]);

  useEffect(() => {
    const newY = centerY - itemHeightRef.current * (item + totalItems * 2);
    if(item >= 0 && targetYRef.current !== newY){
      targetYRef.current = newY;
      distanceRef.current = y - targetYRef.current; 
      deltaRef.current = 0;
    }
  }, [centerY, item, y]);

  useTick(() => {
    const curY = targetYRef.current % size.height;

    if(y === curY) return;

    const time = duration * 1000;
    deltaRef.current += ticker.deltaMS;
    const ratio = deltaRef.current / time;
    const pace = easeInOutSine(ratio) * distanceRef.current;

    if(Math.ceil(deltaRef.current) >= time){
      onFinish();
      setY(curY);
    }else{
      setY((distanceRef.current + targetYRef.current - pace) % size.height);
    }
  });

  return (
    <pixiContainer>
      {Array.from({ length: 2 })
        .map((_, index) => (
          <pixiSprite
            key={index}
            texture={texture}
            x={id * size.width}
            y={index ? y + size.height : y}
            width={size.width}
            height={size.height}
            
          />
        ))}
    </pixiContainer>
  );
};
