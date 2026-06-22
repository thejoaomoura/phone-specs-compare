import { type ReactNode } from 'react';
import { motion, type Transition } from 'framer-motion';

type ClassValue = string | false | null | undefined;

const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ');

interface BeamPath {
  path: string;
  gradientConfig: {
    initial: {
      x1: string;
      x2: string;
      y1: string;
      y2: string;
    };
    animate: {
      x1: string | string[];
      x2: string | string[];
      y1: string | string[];
      y2: string | string[];
    };
    transition?: Transition;
  };
  connectionPoints?: Array<{
    cx: number;
    cy: number;
    r: number;
  }>;
}

interface PulseBeamsProps {
  children?: ReactNode;
  className?: string;
  background?: ReactNode;
  beams: BeamPath[];
  width?: number;
  height?: number;
  baseColor?: string;
  accentColor?: string;
  gradientColors?: {
    start: string;
    middle: string;
    end: string;
  };
}

interface SvgProps extends Required<Pick<PulseBeamsProps, 'width' | 'height' | 'baseColor' | 'accentColor'>> {
  beams: BeamPath[];
  gradientColors?: PulseBeamsProps['gradientColors'];
}

const defaultGradientColors = {
  start: '#C1440E',
  middle: '#F0B89A',
  end: '#F2EDE2',
};

export function PulseBeams({
  children,
  className,
  background,
  beams,
  width = 858,
  height = 434,
  baseColor = 'rgba(196,181,154,0.28)',
  accentColor = 'rgba(242,237,226,0.62)',
  gradientColors,
}: PulseBeamsProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-[24rem] w-full items-center justify-center overflow-hidden antialiased',
        className
      )}
    >
      {background}
      <div className="relative z-10 flex w-full justify-center">{children}</div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <BeamSvg
          beams={beams}
          width={width}
          height={height}
          baseColor={baseColor}
          accentColor={accentColor}
          gradientColors={gradientColors}
        />
      </div>
    </div>
  );
}

function BeamSvg({
  beams,
  width,
  height,
  baseColor,
  accentColor,
  gradientColors,
}: SvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-[110vw] flex-shrink-0 opacity-90"
      aria-hidden="true"
    >
      {beams.map((beam, index) => (
        <g key={beam.path}>
          <path d={beam.path} stroke={baseColor} strokeWidth="1" />
          <path
            d={beam.path}
            stroke={`url(#pulse-grad-${index})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {beam.connectionPoints?.map((point) => (
            <circle
              key={`${point.cx}-${point.cy}`}
              cx={point.cx}
              cy={point.cy}
              r={point.r}
              fill={baseColor}
              stroke={accentColor}
            />
          ))}
        </g>
      ))}

      <defs>
        {beams.map((beam, index) => (
          <motion.linearGradient
            key={`pulse-grad-${index}`}
            id={`pulse-grad-${index}`}
            gradientUnits="userSpaceOnUse"
            initial={beam.gradientConfig.initial}
            animate={beam.gradientConfig.animate}
            transition={beam.gradientConfig.transition}
          >
            <GradientStops colors={gradientColors} />
          </motion.linearGradient>
        ))}
      </defs>
    </svg>
  );
}

function GradientStops({
  colors = defaultGradientColors,
}: {
  colors?: PulseBeamsProps['gradientColors'];
}) {
  return (
    <>
      <stop offset="0%" stopColor={colors.start} stopOpacity="0" />
      <stop offset="20%" stopColor={colors.start} stopOpacity="1" />
      <stop offset="50%" stopColor={colors.middle} stopOpacity="1" />
      <stop offset="100%" stopColor={colors.end} stopOpacity="0" />
    </>
  );
}

export type { BeamPath };
