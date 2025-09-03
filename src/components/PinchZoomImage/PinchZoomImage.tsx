'use client';
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

type Props = {
  src: string;
  alt?: string;
  isTouch: boolean;
  onScaleChange?: (scale: number) => void;
};

export default function PinchZoomImage({ src, alt, isTouch, onScaleChange }: Props) {
  return (
    <TransformWrapper
      minScale={1}
      maxScale={4}
      wheel={{ disabled: isTouch, step: 0.2 }}     // desktop wheel zoom on, mobile off
      doubleClick={{ disabled: isTouch }}          // desktop dbl-click zoom on, mobile off
      pinch={{ disabled: !isTouch }}               // mobile pinch on, desktop off
      panning={{ velocityDisabled: true }}
      onTransformed={({ state }) => onScaleChange?.(state.scale)}
    >
      <TransformComponent
        wrapperStyle={{
          width: '100%',
          height: '100%',
          touchAction: 'none', // let pinch take precedence over the slider
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
