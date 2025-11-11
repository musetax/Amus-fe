'use client';

import Image, { type ImageProps } from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";

export const DEFAULT_COMPANY_LOGO =
  "https://appweb-bucket.s3.us-east-1.amazonaws.com/muse-logo.png";
export const DEFAULT_USER_AVATAR =
  "https://i.ibb.co/Ty3Grj0/dummy-Icon.png";

 

export interface FallbackImageProps
  extends Omit<ImageProps, "src" | "unoptimized"> {
  src?: string | null;
  fallbackSrc?: string;
  unoptimized?: boolean;
}

export const FallbackImage = ({
  src,
  fallbackSrc = DEFAULT_COMPANY_LOGO,
  onError,
  unoptimized,
  ...rest
}: FallbackImageProps) => {
  const resolvedFallback = fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(
    src && src.trim() ? src : resolvedFallback
  );

  useEffect(() => {
    setCurrentSrc(src && src.trim() ? src : resolvedFallback);
  }, [src, resolvedFallback]);

  const handleError = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      if (currentSrc !== resolvedFallback) {
        setCurrentSrc(resolvedFallback);
      }
      onError?.(event);
    },
    [currentSrc, resolvedFallback, onError]
  );

  const shouldUnoptimize = useMemo(() => {
    if (unoptimized !== undefined) return unoptimized;
    return true;
  }, [unoptimized]);

  return (
    <Image
      {...rest}
      src={currentSrc || resolvedFallback}
      onError={handleError}
      unoptimized={shouldUnoptimize}
    />
  );
};

