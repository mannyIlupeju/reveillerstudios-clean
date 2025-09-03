'use client';

import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

type Props = {
  src: string;
  alt?: string;
  isTouch: boolean;
  onScaleChange?: (scale: number) => void;
  touchAction?: React.CSSProperties['touchAction']; // allow parent to toggle swipe vs pinch
};

export default function PinchZoomImage({
  src,
  alt,
  isTouch,
  onScaleChange,
  touchAction,
}: Props) {
  return (
    <TransformWrapper
      minScale={1}
      maxScale={4}
      wheel={{ disabled: isTouch, step: 0.2 }}     // desktop: wheel zoom
      doubleClick={{ disabled: isTouch }}          // desktop: double-click zoom
      pinch={{ disabled: !isTouch }}               // mobile: pinch zoom
      panning={{ velocityDisabled: true }}
      onTransformed={({ state }) => onScaleChange?.(state.scale)}
    >
      <TransformComponent
        wrapperStyle={{
          width: '100%',
          height: '100%',
          // when zoomed on touch we usually want 'none' to prevent carousel swipe
          touchAction: touchAction ?? 'auto',
        }}
      >
        <img
          src={src}
          alt={alt || 'Product image'}
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </TransformComponent>
    </TransformWrapper>
  );
}