import { parse } from "node-html-parser";

async function getMoonByDate() {
  const res = await fetch(`https://www.moongiant.com/phase/today/`);
  const html = await res.text();

  const root = parse(html);
  const summary = root.querySelector("#fullDateTitle > p").innerText.trim();
  const moonDetails = root
    .querySelector("#moonDetails")
    .innerText.split("\n")
    .map((detail) => detail.trim())
    .filter((detail) => detail)
    .map((detail) => detail.split(": "));

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const dateCleaned = new Date().toLocaleDateString("en-US", options);

  const moonData = { date: dateCleaned, summary };

  moonDetails.forEach((row) => {
    let title = row[0].replace(/\s/g, "");
    title = title[0].toLowerCase() + title.slice(1);
    const detail = row[1];
    moonData[title] = detail;
  });

  return moonData;
}

export async function onRequest(context) {
  const moonData = await getMoonByDate();
  return new Response(JSON.stringify(moonData));
}
