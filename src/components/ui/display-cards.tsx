import { type ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

type ClassValue = string | false | null | undefined;

const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ');

export interface DisplayCardProps {
  className?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles size={16} />,
  title = 'Destaque',
  description = 'Conteúdo selecionado',
  date = 'Agora',
  iconClassName = 'bg-rust-500 text-paper-50',
  titleClassName = 'text-rust-400',
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        'relative flex h-36 w-[min(17rem,calc(100vw-4rem))] -skew-y-[8deg] select-none flex-col justify-between overflow-hidden border-2 border-paper-400 bg-paper-200/85 px-4 py-3 text-ink-900 shadow-[0_18px_48px_rgba(28,17,10,0.16)] backdrop-blur-sm transition-all duration-700 before:absolute before:inset-0 before:bg-paper-50/35 before:content-[""] before:transition-opacity before:duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-28 after:bg-gradient-to-l after:from-paper-200 after:to-transparent after:content-[""] hover:border-rust-400 hover:bg-paper-100 hover:before:opacity-0 sm:w-80 [&>*]:relative [&>*]:z-10 [&>*]:flex [&>*]:items-center [&>*]:gap-2',
        className
      )}
    >
      <div>
        <span className={cn('inline-flex size-7 items-center justify-center rounded bg-ink-900', iconClassName)}>
          {icon}
        </span>
        <p className={cn('font-mono text-sm uppercase tracking-[0.12em]', titleClassName)}>
          {title}
        </p>
      </div>
      <p className="truncate font-display text-xl leading-none text-ink-900">
        {description}
      </p>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-50">
        {date}
      </p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

const defaultCards: DisplayCardProps[] = [
  {
    className: '[grid-area:stack] hover:-translate-y-8',
  },
  {
    title: 'Popular',
    description: 'Tendências da semana',
    date: 'Atualizado',
    className: '[grid-area:stack] translate-x-5 translate-y-10 hover:-translate-y-1 sm:translate-x-14',
  },
  {
    title: 'Novo',
    description: 'Últimas adições',
    date: 'Hoje',
    className: '[grid-area:stack] translate-x-10 translate-y-20 hover:translate-y-10 sm:translate-x-28',
  },
];

export default function DisplayCards({ cards = defaultCards }: DisplayCardsProps) {
  return (
    <div className="grid min-h-64 [grid-template-areas:'stack'] place-items-center opacity-100 animate-fade-in">
      {cards.map((cardProps, index) => (
        <DisplayCard key={`${cardProps.title ?? 'display-card'}-${index}`} {...cardProps} />
      ))}
    </div>
  );
}
