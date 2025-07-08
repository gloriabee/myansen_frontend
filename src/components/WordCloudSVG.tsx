// components/WordCloudSVG.tsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud, { Word } from "d3-cloud";

export interface WordFreq {
  text: string;
  value: number;
}

export default function WordCloudSVG({
  words,
  width = 700,
  height = 400,
}: {
  words: WordFreq[];
  width?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const layout = cloud<WordFreq>()
      .size([width, height])
      .words(words.map((d) => ({ text: d.text, value: d.value })))
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .font("Impact")
      .fontSize((d) => Math.sqrt(d.value) * 10)
      .on("end", draw);

    layout.start();

    function draw(words: Word[]) {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svg = d3.select(svgElement);
      svg.selectAll("*").remove();

      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-family", "Impact")
        .style("font-size", (d) => `${d.size}px`)
        .style(
          "fill",
          () =>
            d3.schemeCategory10[
              Math.floor(Math.random() * d3.schemeCategory10.length)
            ] as string
        )
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`
        )
        .text((d: Word) => d.text);
    }
  }, [words, width, height]);

  return <svg ref={svgRef} className="w-full h-auto" />;
}
