import { useEffect, useState } from 'react';
import { Image, ImageStyle } from 'react-native';

type FrameSequenceProps = {
  frames: number[];
  fps?: number;
  style?: ImageStyle | ImageStyle[];
};

export default function FrameSequence({ frames, fps = 12, style }: FrameSequenceProps) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!frames.length) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [frames, fps]);
  return <Image source={frames[index]} style={style as any} />;
}
