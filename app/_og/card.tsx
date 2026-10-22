import { ImageResponse } from 'next/og';
import { copy } from '@/lib/copy';
import { OG_SIZE } from '@/lib/page-metadata';

// opengraph-image 的分享卡（twitter:image 由 Next 從 openGraph 自動帶入）。淺色 Liquid Glass：#FAFAFA 底、
// blue→cyan 光暈與細線；沒有載入宋體，標題交給預設字型。

export function renderOgCard() {
  const { ogCard } = copy.meta;
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAFA',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '8%',
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(250,250,250,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '6%',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(250,250,250,0) 70%)',
          }}
        />

        <div style={{ display: 'flex', fontSize: 20, letterSpacing: '0.4em', color: '#475467', marginBottom: 28 }}>
          {ogCard.kicker}
        </div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 900, letterSpacing: '-0.03em', color: '#101828' }}>
          Tryzeon
        </div>
        <div
          style={{
            width: 96,
            height: 4,
            borderRadius: 2,
            margin: '32px 0',
            background: 'linear-gradient(to right, #2563EB, #60A5FA, #06B6D4)',
          }}
        />
        <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#101828' }}>{ogCard.title}</div>
        <div style={{ display: 'flex', fontSize: 26, color: '#475467', marginTop: 20 }}>
          {ogCard.sub}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
