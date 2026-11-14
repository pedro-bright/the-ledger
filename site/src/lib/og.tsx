// Link preview cards: 1200x630 PNGs rendered at build time with satori and resvg.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { ReactNode } from 'react';
import type { EventData, ThreadData } from './content';

const WIDTH = 1200;
const HEIGHT = 630;

const PAPER = '#FAFAF7';
const INK = '#14130F';
const INK_MUTED = '#5C564D';
const RULE = '#E8E4DA';

const SIGNIFICANCE: Record<string, { bg: string; text: string; label: string }> = {
  landmark: { bg: '#FDF2C5', text: '#7A5A00', label: 'Landmark' },
  major: { bg: '#DBECF9', text: '#0A4D82', label: 'Major' },
  notable: { bg: '#EDEAE3', text: '#5C564D', label: 'Notable' },
};

const CATEGORY: Record<string, string> = {
  policy: '#4338CA',
  models: '#B45309',
  research: '#047857',
  industry: '#6D28D9',
  safety: '#B91C1C',
  culture: '#BE185D',
  'open-source': '#0E7490',
};

const require = createRequire(import.meta.url);
const fontFile = (spec: string) => fs.readFileSync(require.resolve(spec));
const family = (name: string, pkg: string, file: string, weight: 400 | 500 | 600, style: 'normal' | 'italic' = 'normal') =>
  ['latin', 'latin-ext'].map((subset) => ({
    name,
    data: fontFile(`${pkg}/files/${file.replace('SUBSET', subset)}`),
    weight,
    style,
  }));

// Satori draws a variable font at its default instance (Fraunces: weight 900), so Fraunces comes from the static package.
let fonts: ReturnType<typeof family> | undefined;
const loadFonts = () =>
  (fonts ??= [
    ...family('Fraunces', '@fontsource/fraunces', 'fraunces-SUBSET-500-normal.woff', 500),
    ...family('Fraunces', '@fontsource/fraunces', 'fraunces-SUBSET-400-italic.woff', 400, 'italic'),
    ...family('Source Serif 4', '@fontsource-variable/source-serif-4', 'source-serif-4-SUBSET-wght-normal.woff2', 400),
    ...family('Inter', '@fontsource/inter', 'inter-SUBSET-500-normal.woff', 500),
    ...family('Inter', '@fontsource/inter', 'inter-SUBSET-600-normal.woff', 600),
    ...family('JetBrains Mono', '@fontsource/jetbrains-mono', 'jetbrains-mono-SUBSET-400-normal.woff', 400),
  ]);

async function render(node: ReactNode): Promise<Uint8Array> {
  const svg = await satori(node, { width: WIDTH, height: HEIGHT, fonts: loadFonts() });
  // Satori draws text as paths, so skip resvg's slow scan of system fonts.
  return new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
}

export const pngResponse = (png: Uint8Array) => new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });

function Mark({ size }: { size: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        border: `${size / 32}px solid ${INK}`,
        fontFamily: 'Fraunces',
        fontWeight: 500,
        fontSize: size * 0.58,
        color: INK,
      }}
    >
      L
    </div>
  );
}

function Label({ children, color, background }: { children: string; color: string; background?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: background ? '4px 12px 5px' : '0',
        background,
        borderRadius: 3,
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color,
      }}
    >
      {children}
    </div>
  );
}

// Card frame: masthead strip, rule, body, rule, footer strip.
function Card({ kicker, children, footer }: { kicker: ReactNode; children: ReactNode; footer: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: WIDTH,
        height: HEIGHT,
        padding: '56px 72px',
        background: PAPER,
        color: INK,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 24, borderBottom: `2px solid ${RULE}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Mark size={44} />
          <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 30, letterSpacing: '-0.012em' }}>The Ledger</div>
        </div>
        {kicker}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, minHeight: 0 }}>{children}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 24, borderTop: `2px solid ${RULE}` }}>{footer}</div>
    </div>
  );
}

// Long titles stop after `lines` lines with an ellipsis.
function Title({ text, size, lines }: { text: string; size: number; lines: number }) {
  return (
    <div
      style={{
        display: 'block',
        fontFamily: 'Fraunces',
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.12,
        letterSpacing: '-0.015em',
        lineClamp: lines,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {text}
    </div>
  );
}

export function defaultCard() {
  return render(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 40,
        boxSizing: 'border-box',
        width: WIDTH,
        height: HEIGHT,
        padding: '0 120px',
        background: PAPER,
        color: INK,
      }}
    >
      <Mark size={160} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 84, letterSpacing: '-0.015em', lineHeight: 1 }}>The Ledger</div>
        <div style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 36, color: INK_MUTED }}>A sourced historical record of AI</div>
      </div>
    </div>,
  );
}

export function eventCard(event: EventData) {
  const significance = event.significance ? SIGNIFICANCE[event.significance] : undefined;
  return render(
    <Card
      kicker={<div style={{ fontFamily: 'JetBrains Mono', fontSize: 26, color: INK_MUTED }}>{event.date}</div>}
      footer={
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: CATEGORY[event.category] ?? INK_MUTED }} />
            <Label color={INK}>{event.category.replace(/-/g, ' ')}</Label>
          </div>
          {significance && <Label color={significance.text} background={significance.bg}>{significance.label}</Label>}
        </>
      }
    >
      <Title text={event.title} size={60} lines={4} />
    </Card>,
  );
}

export function threadCard(thread: ThreadData, entries: number) {
  return render(
    <Card
      kicker={<Label color={INK_MUTED}>Thread</Label>}
      footer={
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 24, color: INK_MUTED }}>
          {`${entries} ${entries === 1 ? 'entry' : 'entries'}`}
        </div>
      }
    >
      <Title text={thread.title} size={60} lines={2} />
      {thread.core_question && (
        <div
          style={{
            display: 'block',
            marginTop: 20,
            fontFamily: 'Source Serif 4',
            fontSize: 30,
            lineHeight: 1.35,
            color: INK_MUTED,
            lineClamp: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {/* No installed font subset has the arrow glyph. */}
          {thread.core_question.replace(/\s*→\s*/g, ' to ')}
        </div>
      )}
    </Card>,
  );
}
