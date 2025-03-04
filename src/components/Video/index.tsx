import { FC, HTMLAttributes, useState, useCallback, useImperativeHandle, RefObject } from "react";
import styled from "styled-components";

export type VideoHandle = {
  next: () => void;
};

export type VideoProps = HTMLAttributes<HTMLDivElement> & {
  ref: RefObject<VideoHandle | null>;
};

export const Video: FC<VideoProps> = ({ ref }) => {
  const videos = ['videos/bay.mp4', 'videos/space.mp4', 'videos/sunflower.mp4', 'videos/waterfalls.mp4'];
  const [curVideo, setCurVideo] = useState(0);

  const nextVideo = useCallback(() => {
    setCurVideo(n => (n + 1) % videos.length);
  }, [videos.length]);

  useImperativeHandle(ref, () => {
    return {
      next() {
        nextVideo();
      },
    }
  }, [nextVideo]);

  return(
    <Container>
      <video src={videos[curVideo]} autoPlay muted />
      <Button onClick={nextVideo}>{'>'}</Button>
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
  grid-column: 3 / 4;

  @media (orientation: portrait) {
    grid-row: 1 / 2;
    grid-column: 1;
  }

  & > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Button = styled.button`
  position: absolute;
  padding: 10px;
  right: 10px;
  top: 50%;
  border: 0 none;
  font-size: 1rem;
  cursor: pointer;
  color: #eee;

  @media (orientation: landscape) {
    opacity: 0.5;
  }

  &:hover {
    opacity: 1;
  }
`;
