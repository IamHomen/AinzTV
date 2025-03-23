import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url"; // Fix __dirname for ESM
import * as cheerio from "cheerio"; // ✅ Correct
import NodeCache from "node-cache";
import Kwik from "./kwik.js"; // Ensure kwik.js also uses ESM
import { USER_AGENT } from "./utils.js";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

// ✅ Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views are loaded from 'views/' folder

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const ANIMEPAHE_BASE_URL = "https://animepahe.ru";

// 🌟 Fetch anime data and render home.ejs
app.get("/", async (req, res) => {
    const cacheKey = "recent-anime";
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log("✅ Serving from cache");
        return res.render("home", { animeList: cachedData });
    }

    const url = `${ANIMEPAHE_BASE_URL}/api?m=airing&page=1`;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Referer": ANIMEPAHE_BASE_URL,
        "Accept-Language": "en-US,en;q=0.9",
        "Cookie": "__ddgid_=uvwe8pkY9vVMTdG0; __ddg2_=Het8LdaILfm0B2E8; __ddg1_=MOiywMi3RBLrrGLZtxcS; res=1080; aud=jpn; av1=0; latest=5667; ann-fakesite=0; __ddg9_=110.54.144.240; __ddg10_=1742379866; __ddg8_=RkelUegxikezVZUS; XSRF-TOKEN=eyJpdiI6Ing2SkFTMWlzNy8yd1BkWlloNEY3bWc9PSIsInZhbHVlIjoiMG9KaFFQYjFTSDRTWUpSWlZpaVRkLzU1KzJzNFdGQlNZNGpOQjdISjAxYjBDWnJDalROZWI4MUZzcUs2Q3hnTDR5a1lpMi9pR05xbHBqc3FxbXFuRS9sNWpTd3UwZkdsMTRCNzN0WFFGL1E0M2tuYlF6VHkvY1NTK0tzQ29SZEMiLCJtYWMiOiJlMzhhMmJhNDQyOWRmYmMyMDYwNWE3ODAwYzExZGE3ZTI4OWIzMzE4Nzk3NWU1YTY0ZWEyYmUwN2FkM2I4NGZiIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlBSU0NyR0hMVnR0OEtSdGptdUZ4OWc9PSIsInZhbHVlIjoiY1I4NzRLVUIrL2x6b1U5b29FLzU1bUdCemlzK0RGMENBT0hzbXNCNHF6eGV1cmZTRmMwZ3V2bHluOEVNOVFJVkNxU3FGS0sxNjZyUG9xcStNNzROSUMvUTc3K1pYdlcyTHNCZjBaQ1Z2RjFWQzZ6c0N2M2Rza0FLaUpIckVVS3YiLCJtYWMiOiI5ZWI1OGZiY2E3ZjZhMmNlYWQ2Mzk5MDJmMGM4YTkxNDUyZmUwOTQ0YmJjMGRhNjVmNGQwZTBkYTFhZjY4OWMxIiwidGFnIjoiIn0%3D",
    };

    try {
        const response = await axios.get(url, { headers });
        const animeList = response.data.data || [];

        // ✅ Store in cache for 30 minutes
        cache.set(cacheKey, animeList, 1800);
        console.log("🚀 Fetched from API and cached");

        res.render("home", { animeList });
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.render("home", { animeList: [] });
    }
});

// Fetch anime details AND episode sources in a single request
app.get("/anime/:id/:session?", async (req, res) => {
    try {
        const { id, session } = req.params;
        const cacheKey = `anime-${id}`;
        let animeData = cache.get(cacheKey);

        if (!animeData) {
            // ✅ Fetch Anime Info
            const url = `${ANIMEPAHE_BASE_URL}/anime/${id}`;
            const headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
                "Referer": ANIMEPAHE_BASE_URL,
                "Accept-Language": "en-US,en;q=0.9",
                "Cookie": "__ddg2_=; res=1080; aud=jpn;",
            };

            const response = await axios.get(url, { headers });
            const $ = cheerio.load(response.data);

            animeData = {
                animeCover: `https:${$("div.anime-cover").attr("data-src")}`,
                animePoster: $(".anime-poster a").attr("href"),
                title: $("div.title-wrapper > h1 > span").text().trim(),
                alternativeTitle: $("h2.japanese").text().trim(),
                description: $("div.anime-summary").text().trim(),
                genres: $("div.anime-genre ul li a").map((i, el) => $(el).attr("title")).get(),
                status: $('div.anime-info p:contains("Status:") a').text().trim(),
                duration: $('div.anime-info p:contains("Duration:")').text().replace("Duration:", "").trim(),
                type: $('div.anime-info p:contains("Type:") a').text().trim(),
                releaseDate: $('div.anime-info p:contains("Aired:")').text().split("to")[0].replace("Aired:", "").trim(),
                studios: $('div.anime-info p:contains("Studio:")').text().replace("Studio:", "").trim().split("\n"),
                totalEpisodes: parseInt($('div.anime-info p:contains("Episodes:")').text().replace("Episodes:", ""), 10),
                relations: [],
                recommendations: [],
                episodes: [],
            };

            // ✅ Fetch Episodes
            try {
                const episodeApiUrl = `${ANIMEPAHE_BASE_URL}/api?m=release&id=${id}&sort=episode_asc&page=1`;
                const { data } = await axios.get(episodeApiUrl, { headers });

                if (data && data.data) {
                    animeData.episodes = data.data.map((ep) => ({
                        episodeNum: ep.episode,
                        episodeUrl: `/anime/${id}/${ep.session}`,
                        episodeSnapshot: ep.snapshot,
                        episodeDuration: ep.duration,
                    }));
                }
            } catch (episodeError) {
                console.error("Error fetching episode data:", episodeError.message);
            }

            cache.set(cacheKey, animeData);
        }

        let sources = [];
        if (session) {
            // ✅ Fetch episode sources
            const episodeUrl = `${ANIMEPAHE_BASE_URL}/play/${id}/${session}`;
            const episodeResponse = await axios.get(episodeUrl, { headers: Headers(session.split('/')[0]) });
            const $ = cheerio.load(episodeResponse.data);

            const links = $("div#resolutionMenu > button")
                .map((i, el) => ({
                    url: $(el).attr("data-src"),
                    quality: $(el).text(),
                    audio: $(el).attr("data-audio"),
                }))
                .get();

            for (const link of links) {
                const kwikResponse = await new Kwik().extract(new URL(link.url));
                if (kwikResponse.length > 0) {
                    kwikResponse[0].quality = link.quality;
                    kwikResponse[0].isDub = link.audio === "eng";
                    sources.push(kwikResponse[0]);
                }
            }
        }

        // ✅ Render anime.ejs with BOTH animeData and sources
        res.render("anime", { animeData, sources });
        console.log("Server.js", sources);

    } catch (error) {
        console.error("Error fetching anime or episode sources:", error.message);
        res.status(500).send("Failed to fetch anime data.");
    }
});

//Headers
function Headers(sessionId) {
    return {
        authority: "animepahe.ru",
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        cookie: "__ddg2_=;",
        dnt: "1",
        "sec-ch-ua": '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        referer: sessionId ? `${ANIMEPAHE_BASE_URL}/anime/${sessionId}` : `${ANIMEPAHE_BASE_URL}`,
        "user-agent": USER_AGENT,
    };
}

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});