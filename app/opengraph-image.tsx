import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Tryzeon - 重新定義你的時尚新生活';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
                    backgroundColor: '#0A0A0B',
                    position: 'relative',
                }}
            >
                {/* Background glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: 500,
                        height: 500,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '15%',
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)',
                    }}
                />

                {/* Brand name */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 72,
                        fontWeight: 900,
                        color: '#FFFFFF',
                        letterSpacing: '-0.03em',
                        marginBottom: 16,
                    }}
                >
                    Tryzeon
                </div>

                {/* Tagline */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 28,
                        color: '#98A2B3',
                        fontWeight: 500,
                        marginBottom: 40,
                    }}
                >
                    The Future of Digital Style
                </div>

                {/* Accent line */}
                <div
                    style={{
                        width: 80,
                        height: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(to right, #2563EB, #60A5FA)',
                    }}
                />

                {/* Subtitle */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 20,
                        color: '#667085',
                        fontWeight: 500,
                        marginTop: 32,
                    }}
                >
                    從試穿開始，重新定義你的時尚新生活
                </div>
            </div>
        ),
        {
            ...size,
        },
    );
}
