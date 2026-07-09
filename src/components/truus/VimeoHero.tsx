'use client';

export default function VimeoHero() {
    return (
        <div className="vimeo-hero">
            {/* Gradient fade */}
            <div className="vimeo-hero__fade" />

            {/* ① Headline — bottom left, word-by-word layout */}
            <div className="home-header__title">
                <h1 className="vimeo-hero__title">

                    {/* "we" */}
                    <span className="vimeo-hero__word">we </span>

                    {/* "make" + ⑤ smiley (no animation) */}
                    <span className="vimeo-hero__word is--relative">
                        <span>make </span>
                        <div className="home-header__smiley">
                            <img
                                src="/assets/VimeoHero SVG/smiley-face.svg"
                                alt=""
                                className="home-header__smiley-svg"
                            />
                        </div>
                    </span>

                    {/* "advertising" italic */}
                    <span className="vimeo-hero__word"><em>advertising </em></span>

                    {/* "for" */}
                    <span className="vimeo-hero__word">for </span>

                    <div style={{ flexBasis: '100%', height: 0 }} />

                    <span className="vimeo-hero__word">the </span>
                    <span className="vimeo-hero__word">new </span>

                    {/* "mainstream" + ⑤ pink star (no spin) + oval underline */}
                    <span className="vimeo-hero__word is--relative">
                        <div className="home-header__star">
                            <div className="home-header__star-inner">
                                <img
                                    src="/assets/VimeoHero SVG/pink-star.svg"
                                    alt=""
                                    className="home-header__star-svg"
                                />
                            </div>
                        </div>
                        {/* Oval underline */}
                        <img
                            src="/assets/VimeoHero SVG/oval-underline.svg"
                            alt=""
                            className="home-header__title-line-svg"
                        />
                        <span>mainstream</span>
                    </span>

                </h1>
            </div>
        </div>
    );
}
