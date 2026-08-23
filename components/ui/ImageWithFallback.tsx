'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

const FALLBACK_SRC = '/doctors/doctor1.png';

export default function ImageWithFallback({ src, alt, ...rest }: ImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            onError={() => setImgSrc(FALLBACK_SRC)}
        />
    );
}
