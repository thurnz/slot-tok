import { FC, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Reel } from "../Reel";
import { Application } from "@pixi/react";
import { Assets, Texture } from "pixi.js";
import { useDebounceCallback, useEventListener } from "usehooks-ts";

export interface SlotMachineProps {
  onSpin: () => void;
};

export const SlotMachine: FC<SlotMachineProps> = ({ onSpin }) => {
  const itemRef= useRef([0, 0, 0, 0, 0]);
  const timeRef = useRef([0, 0, 0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const ctrRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [texture, setTexture] = useState<Texture>();
  const [width, setWidth] = useState(0);

  const handleResize = () => {
    if(containerRef.current) setWidth(containerRef.current.clientWidth);
  };

  useEffect(() => {
    handleResize();
  });

  const debounceResize = useDebounceCallback(handleResize, 250);
  useEventListener('resize', debounceResize);

  useEffect(() => {
    const load = async () => {
      const t = await Assets.load("images/fruits.png");
      setTexture(t);
    };

    if(!texture) load();
  }, [texture]);

  const handleRepeat = () => {
    if(isSpinning) return;
    itemRef.current = itemRef.current.map((value) => {
      let n = value;
      while(n === value){
        n = Math.floor(Math.random() * 9);
      };
      return n;
    });
    timeRef.current = [0.75, 1, 1.25, 1.5, 2];
    setIsSpinning(true);
  };

  useEffect(() => {
    if(isSpinning) {
      ctrRef.current = 0;
      onSpin();
    }
  }, [isSpinning, onSpin]);

  const handleFinish = () => {
    ctrRef.current++;
    if(ctrRef.current >= itemRef.current.length) setIsSpinning(false);
  };

  if(!texture) return null;

  return(
    <Container ref={containerRef}>
      <Application resizeTo={containerRef} backgroundAlpha={0}>
        {itemRef.current.map((value, index) => 
          <Reel key={index} id={index} item={value} duration={timeRef.current[index]} texture={texture} width={width / itemRef.current.length} onFinish={handleFinish} />
        )}
      </Application>
      <Repeat onClick={handleRepeat} $disable={isSpinning} />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  overflow: hidden;
  grid-row: 1;
  grid-column: 2 / 3;

  @media (orientation: portrait) {
    grid-row: 2 / 3;
    grid-column: 1;
  }
`;

const Repeat = styled.div<{ $disable: boolean }>`
  position: absolute;
  width: 20svh;
  height: 20svh;
  border-radius: 50%;
  border: 2px solid #fff;
  background: #333 url(images/repeat.png) center / 75% auto no-repeat;
  left: calc((100% - 20svh) / 2);
  bottom: 10px;
  cursor: pointer;
  transition: opacity 0.25s;
  pointer-events: ${props => props.$disable ? 'none' : 'auto'};

  @media (orientation: landscape) {
    opacity: 0.5;
  }

  @media (orientation: portrait) {
    width: 12svh;
    height: 12svh;
    left: calc((100% - 12svh) / 2);
  }

  &:hover {
    opacity: 0.8;
  }
`;
