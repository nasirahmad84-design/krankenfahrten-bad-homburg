import type {CSSProperties, ReactNode} from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {type ArticleVideoProps, validateArticleVideoProps} from "./article-video-data";

export type {ArticleVideoProps} from "./article-video-data";

const colors = {
  navy: "#021f58",
  navyLight: "#123b78",
  green: "#5fa538",
  greenDark: "#44772a",
  greenLight: "#a8d88a",
  white: "#fefefe",
  surface: "#f6f9fc",
} as const;

const fontFamily = "Arial, Helvetica, sans-serif";

function revealStyle(frame: number, fps: number): CSSProperties {
  const progress = spring({frame, fps, config: {damping: 18, mass: 0.8, stiffness: 120}});
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(progress, [0, 1], [70, 0])}px)`,
  };
}

function Shell({children, dark = false}: {children: ReactNode; dark?: boolean}) {
  return (
    <AbsoluteFill
      style={{
        background: dark ? colors.navy : colors.surface,
        color: dark ? colors.white : colors.navy,
        fontFamily,
        padding: "100px 76px 82px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "36px 36px auto",
          height: 12,
          borderRadius: 999,
          background: dark ? colors.navyLight : "#e1e9f2",
          overflow: "hidden",
        }}
      >
        <ProgressBar />
      </div>
      {children}
    </AbsoluteFill>
  );
}

function ProgressBar() {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div
      style={{
        width: `${interpolate(frame, [0, durationInFrames - 1], [0, 100], {extrapolateRight: "clamp"})}%`,
        height: "100%",
        background: colors.green,
      }}
    />
  );
}

function Brand({inverse = false}: {inverse?: boolean}) {
  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 30}}>
      <div
        style={{
          background: inverse ? colors.white : "transparent",
          borderRadius: inverse ? 18 : 0,
          padding: inverse ? "12px 18px" : 0,
        }}
      >
        <Img
          src={staticFile("brand/logo.svg")}
          style={{width: inverse ? 324 : 360, height: inverse ? 72 : 86, objectFit: "contain", objectPosition: "left center"}}
        />
      </div>
      <div
        style={{
          color: inverse ? colors.greenLight : colors.greenDark,
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        Kurz erklärt
      </div>
    </div>
  );
}

function Intro({title}: {title: string}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Shell>
      <Brand />
      <div style={{...revealStyle(frame - 8, fps), marginTop: 190}}>
        <div style={{fontSize: 34, fontWeight: 800, color: colors.greenDark, marginBottom: 28}}>RATGEBER</div>
        <h1 style={{fontSize: 82, lineHeight: 1.05, letterSpacing: -3, margin: 0, fontWeight: 850}}>{title}</h1>
        <p style={{fontSize: 42, lineHeight: 1.3, color: colors.navyLight, margin: "58px 0 0", fontWeight: 600}}>
          Drei geprüfte Punkte in 30 Sekunden.
        </p>
      </div>
      <RoadDecoration />
    </Shell>
  );
}

function Point({number, text}: {number: number; text: string}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Shell dark={number === 2}>
      <Brand inverse={number === 2} />
      <div style={{...revealStyle(frame, fps), display: "flex", flexDirection: "column", flex: 1, justifyContent: "center"}}>
        <div
          style={{
            width: 118,
            height: 118,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: colors.green,
            color: colors.navy,
            fontSize: 54,
            fontWeight: 900,
            marginBottom: 54,
          }}
        >
          {number}
        </div>
        <p
          lang="de"
          style={{
            width: "100%",
            maxWidth: 928,
            fontSize: 52,
            lineHeight: 1.22,
            letterSpacing: -1.2,
            margin: 0,
            fontWeight: 800,
            overflowWrap: "break-word",
            hyphens: "auto",
          }}
        >
          {text}
        </p>
      </div>
    </Shell>
  );
}

function Closing({reviewedAt, sources}: Pick<ArticleVideoProps, "reviewedAt" | "sources">) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sourceNames = [...new Set(sources.map(({publisher}) => publisher))].join(" · ");
  return (
    <Shell>
      <Brand />
      <div style={{...revealStyle(frame, fps), marginTop: 155}}>
        <div style={{fontSize: 35, fontWeight: 800, color: colors.greenDark, marginBottom: 30}}>UNSER ANGEBOT</div>
        <p style={{fontSize: 70, lineHeight: 1.12, letterSpacing: -2.5, margin: 0, fontWeight: 850}}>
          Planbare sitzende Krankenfahrten – ohne medizinische Betreuung.
        </p>
        <div
          style={{
            background: colors.green,
            borderRadius: 34,
            padding: "34px 44px",
            marginTop: 72,
            fontSize: 38,
            fontWeight: 900,
            textAlign: "center",
          }}
        >
          Mehr erfahren auf krankenfahrten-bad-homburg.de
        </div>
      </div>
      <p style={{fontSize: 22, lineHeight: 1.35, color: colors.navyLight, margin: "auto 0 0"}}>
        Quellen: {sourceNames} · Redaktionell geprüft: {formatDate(reviewedAt)} · Keine medizinische oder versicherungsrechtliche Einzelfallberatung.
      </p>
    </Shell>
  );
}

function RoadDecoration() {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 150], [-200, 930], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: 68, height: 116, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 28, height: 8, background: colors.navy}} />
      <div
        style={{
          position: "absolute",
          left: x,
          bottom: 37,
          width: 170,
          height: 62,
          borderRadius: "38px 50px 14px 14px",
          background: colors.green,
          boxShadow: `inset 0 -10px 0 ${colors.greenDark}`,
        }}
      >
        <div style={{position: "absolute", left: 28, top: -27, width: 92, height: 44, borderRadius: "46px 46px 0 0", background: colors.navyLight}} />
        {[35, 125].map((left) => (
          <div key={left} style={{position: "absolute", left, bottom: -18, width: 40, height: 40, borderRadius: 999, background: colors.navy}} />
        ))}
      </div>
    </div>
  );
}

export function ArticleExplainer(props: ArticleVideoProps) {
  const errors = validateArticleVideoProps(props);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={150}><Intro title={props.title} /></Sequence>
      <Sequence from={150} durationInFrames={180}><Point number={1} text={props.summary[0]} /></Sequence>
      <Sequence from={330} durationInFrames={180}><Point number={2} text={props.summary[1]} /></Sequence>
      <Sequence from={510} durationInFrames={180}><Point number={3} text={props.summary[2]} /></Sequence>
      <Sequence from={690} durationInFrames={210}><Closing reviewedAt={props.reviewedAt} sources={props.sources} /></Sequence>
    </AbsoluteFill>
  );
}

export function ArticleStill(props: ArticleVideoProps) {
  const errors = validateArticleVideoProps(props);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return (
    <AbsoluteFill style={{background: colors.surface, color: colors.navy, fontFamily, padding: "70px 74px"}}>
      <Brand />
      <div style={{display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 58, flex: 1, alignItems: "center"}}>
        <div>
          <div style={{fontSize: 28, fontWeight: 850, color: colors.greenDark, marginBottom: 25}}>RATGEBER</div>
          <h1 style={{fontSize: 64, lineHeight: 1.05, letterSpacing: -2.5, margin: 0, fontWeight: 850}}>{props.title}</h1>
          <p style={{fontSize: 30, lineHeight: 1.3, color: colors.navyLight, margin: "38px 0 0", fontWeight: 650}}>
            Verständlich erklärt und anhand offizieller Quellen geprüft.
          </p>
        </div>
        <div style={{background: colors.navy, borderRadius: 42, padding: "58px 44px", color: colors.white}}>
          <div style={{fontSize: 30, color: colors.greenLight, fontWeight: 850, marginBottom: 24}}>DAS WICHTIGSTE</div>
          <p style={{fontSize: 35, lineHeight: 1.25, margin: 0, fontWeight: 750}}>{props.summary[0]}</p>
        </div>
      </div>
      <div style={{height: 15, borderRadius: 999, background: colors.green}} />
    </AbsoluteFill>
  );
}

function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}
