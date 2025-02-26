import { FC, HTMLAttributes, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Reel } from "../Reel";


export type SlotMachineProps = HTMLAttributes<HTMLDivElement> & {
  onSpin: () => void;
};

export const SlotMachine: FC<SlotMachineProps> = ({ onSpin }) => {
  const itemRef= useRef([0, 1, 2, 3, 4]);
  const time = [0.75, 1, 1.25, 1.5, 2];
  const [isSpinning, setIsSpinning] = useState(false);
  const ctrRef = useRef(0);

  const handleRepeat = () => {
    if(isSpinning) return;
    itemRef.current = itemRef.current.map(() => 9 + Math.floor(Math.random() * 9));
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
    if(ctrRef.current >= 10) setIsSpinning(false);
  };

  return(
    <Container >
      {itemRef.current.map((value, index) => 
        <Reel key={index} item={value} duration={time[index]} reset={!isSpinning} onFinish={handleFinish} />
      )}
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
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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
