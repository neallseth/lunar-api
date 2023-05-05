import { parse } from "node-html-parser";

async function getFullMoon() {
  const res = await fetch(`https://www.moongiant.com/`);
  const html = await res.text();

  const root = parse(html);
  const fullMoonDate =
    root.querySelector(".nextCopy > h2").firstChild.innerText;

  return { nextFullMoon: fullMoonDate };
}

export async function onRequest(context) {
  const moonData = await getFullMoon();
  return new Response(JSON.stringify(moonData));
}
