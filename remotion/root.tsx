import {Composition} from "remotion";
import pilotArticle from "../automation/blog/published/krankenfahrt-oder-krankentransport-unterschied.json";
import {ArticleExplainer, ArticleStill, type ArticleVideoProps} from "./article-video";

const defaultProps = pilotArticle satisfies ArticleVideoProps;

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="ArticleExplainer"
        component={ArticleExplainer}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
      <Composition
        id="ArticleStill"
        component={ArticleStill}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
    </>
  );
}
