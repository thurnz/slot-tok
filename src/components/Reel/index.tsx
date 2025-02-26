import { FC, HTMLAttributes, useEffect, useState, useRef } from "react";
import styled from "styled-components";

export type ReelProps = HTMLAttributes<HTMLDivElement> & {
  item: number;
  duration: number;
  reset: boolean;
  onFinish: () => void;
};

export const Reel: FC<ReelProps> = ({ item, duration, reset, onFinish }) => {
  const [y, setY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const origWidth = 148;
  const origHeight =1692;
  const totalItems = 9;
  const heightRef = useRef(0);

  useEffect(() => {
    if(!containerRef.current) return;

    heightRef.current = containerRef.current.clientWidth / origWidth * origHeight / totalItems;
    setY((containerRef.current.clientHeight - heightRef.current) / 2 - heightRef.current * (item + totalItems * 2));

    const handleTransitionEnd = () => {
      containerRef.current?.removeEventListener('transitionend', handleTransitionEnd);
      onFinish();
    };

    containerRef.current.addEventListener('transitionend', handleTransitionEnd);
  }, [item, onFinish]);

  useEffect(() => {
    if(reset) setY(y => y+= heightRef.current * totalItems * 2);
  }, [reset, setY]);

  return(
    <Container ref={containerRef} $y={y} $duration={duration} $reset={reset} />
  );
};

export const Container = styled.div<{ $y: number, $duration: number, $reset: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  background: url('images/fruits.png') center ${props => props.$y}px / 100% auto repeat-y;
  will-change: backgroundPosition;
  transition: ${props =>  props.$reset ? 0 : props.$duration}s background-position ease-in-out;
`;
