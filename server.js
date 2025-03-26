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
const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";
const ANIMEPAHE_SEARCH_URL = "https://animepahe.ru/api";

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Referer": ANIMEPAHE_BASE_URL,
    "Accept-Language": "en-US,en;q=0.9",
    "Cookie": "__ddg2_=; res=1080; aud=jpn;",
};


// 🌟 Fetch anime data and render home.ejs
app.get("/", async (req, res) => {
    const cacheKeyAnime = "recent-anime";
    const cacheKeyTrending = "trending-anime";
    const cacheKeyGenreThriller = "thriller-anime";

    const cachedAnime = cache.get(cacheKeyAnime);
    const cachedTrending = cache.get(cacheKeyTrending);
    const cacheGenreThriller = cache.get(cacheKeyGenreThriller);

    // ✅ Serve from cache if available
    if (cachedAnime && cachedTrending && cacheGenreThriller) {
        console.log("✅ Serving both anime list, trending list and thriller list from cache");
        return res.render("home", { animeList: cachedAnime, trendingList: cachedTrending, thrillerList: cacheGenreThriller });
    }

    const url = `${ANIMEPAHE_BASE_URL}/api?m=airing&page=1`;

    try {

        // ✅ Fetch thrillerResult only if not cached
        let thrillerResults;
        if (cacheGenreThriller) {
            console.log("✅ Serving thriller results from cache");
            thrillerResults = cacheGenreThriller;
        } else {
            thrillerResults = await mapAniListToAnimePaheThriller();
            cache.set(cacheKeyGenreThriller, thrillerResults, 1800); // Cache for 30 minutes
            console.log("🚀 Fetched thriller results and cached");
        }

        // ✅ Fetch Trending only if not cached
        let mappedResults;
        if (cachedTrending) {
            console.log("✅ Serving mapped results from cache");
            mappedResults = cachedTrending;
        } else {
            mappedResults = await mapAniListToAnimePahe();
            cache.set(cacheKeyTrending, mappedResults, 1800); // Cache for 30 minutes
            console.log("🚀 Fetched mapped results and cached");
        }

        // ✅ Fetch recent anime if not cached
        let animeList;
        if (cachedAnime) {
            console.log("✅ Serving anime list from cache");
            animeList = cachedAnime;
        } else {
            const response = await axios.get(url, { headers });
            animeList = response.data.data || [];
            cache.set(cacheKeyAnime, animeList, 1800); // Cache for 30 minutes
            console.log("🚀 Fetched anime list and cached");
        }

        res.render("home", { animeList, trendingList: mappedResults, thrillerList: thrillerResults });
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.render("home", { animeList: [], trendingList: [], thrillerList: [] });
    }
});

// Fetch anime details AND episode sources in a single request
app.get("/anime/:id/:session?", async (req, res) => {
    try {
        const { id, session } = req.params;
        const cacheKey = `anime-${id}`;
        let animeData = cache.get(cacheKey);
        let trailerUrl;

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
                animePoster: $('div.anime-poster > a > img').attr("data-src"),
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
                anilistId: $('a[href*="anilist.co/anime/"]').attr("href")?.match(/anime\/(\d+)/)?.[1],
                relations: [],
                recommendations: [],
                episodes: [],
            };

            const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";

            async function getAnimeTrailer(anilistId) {
                const query = `
                    query ($id: Int) {
                      Media(id: $id, type: ANIME) {
                        id
                        title {
                          romaji
                          english
                          native
                        }
                        trailer {
                          id
                          site
                          thumbnail
                        }
                      }
                    }
                `;

                const variables = { id: anilistId };

                try {
                    const response = await fetch(ANILIST_GRAPHQL_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query, variables }),
                    });

                    const { data } = await response.json();
                    const anime = data?.Media;

                    if (!anime || !anime.trailer) {
                        console.log("No trailer found.");
                        return null;
                    }

                    trailerUrl =
                        anime.trailer.site === "youtube"
                            ? `https://www.youtube.com/embed/${anime.trailer.id}`
                            : `https://www.dailymotion.com/video/${anime.trailer.id}`;

                    return { title: anime.title.romaji, trailerUrl, thumbnail: anime.trailer.thumbnail };
                } catch (error) {
                    console.error("Error fetching AniList data:", error);
                }
            }
            animeData.trailer = await getAnimeTrailer(animeData.anilistId);

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
        let currentEpisode = null;
        if (session) {
            // ✅ Fetch episode sources
            const episodeUrl = `${ANIMEPAHE_BASE_URL}/play/${id}/${session}`;
            const episodeResponse = await axios.get(episodeUrl, { headers: Headers(session.split('/')[0]) });
            const $ = cheerio.load(episodeResponse.data);

            currentEpisode = $("div.episode-menu > button").text();

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
        res.render("anime", { animeData, sources, currentEpisode, trailerUrl });
        console.log(sources);

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

// ✅ Step 1: Query AniList API for Trending Anime
async function getTrendingAnime() {
    const query = `
        query {
            Page(perPage: 10) { 
                media(type: ANIME, sort: TRENDING_DESC) {
                    id
                    type
                    duration
                    nextAiringEpisode {
                        airingAt
                        episode
                    }
                    title {
                        romaji
                        english
                        native
                    }
                    coverImage {
                        extraLarge
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(ANILIST_GRAPHQL_URL, { query });
        return response.data.data.Page.media;
    } catch (error) {
        console.error("Error fetching trending anime from AniList:", error);
        return [];
    }
}

// ✅ Step 2: Search AnimePahe by AniList ID
async function searchAnimePahe(anilistId, title) {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Referer": ANIMEPAHE_BASE_URL,
        "Accept-Language": "en-US,en;q=0.9",
        "Cookie": "__ddg2_=; res=1080; aud=jpn;",
    };
    try {
        const response = await axios.get(`${ANIMEPAHE_SEARCH_URL}?m=search&l=8&q=${encodeURIComponent(title)}`,  { headers });
        const results = response.data.data;

        if (!results || results.length === 0) {
            return null;
        }

        // Find anime with matching AniList ID
        return results.find(anime => anime.anilist_id === anilistId) || results[0]; // Fallback to first result
    } catch (error) {
        console.error(`Error searching AnimePahe for ${title}:`, error);
        return null;
    }
}

// ✅ Step 3: Map AniList to AnimePahe
async function mapAniListToAnimePahe() {
    const trendingAnime = await getTrendingAnime();
    let mappedResults = [];

    const formatAiringDate = (timestamp) => {
        if (!timestamp) return "TBA";
        const date = new Date(timestamp * 1000);
        return date.toLocaleString("en-US", { 
            weekday: "short", 
            month: "short", 
            day: "2-digit", 
            year: "numeric", 
            hour: "2-digit", 
            minute: "2-digit", 
            hour12: true 
        });
    };

    for (const anime of trendingAnime) {
        const { id, title } = anime;
        const searchTitle = title.romaji || title.english || title.native;
        const animeCover = anime.coverImage.extraLarge;
        const type = anime.type;
        const duration = anime.duration ? `${anime.duration} min` : "Unknown";
        
        const nextAiringEpisode = anime.nextAiringEpisode 
            ? {
                episode: anime.nextAiringEpisode.episode,
                airingAt: formatAiringDate(anime.nextAiringEpisode.airingAt)
            } 
            : { episode: "?", airingAt: "TBA" };

        const animepaheResult = await searchAnimePahe(id, searchTitle);

        mappedResults.push({
            anilist_id: id,
            anilist_title: searchTitle,
            anilist_cover: animeCover,
            type,
            duration,
            nextAiringEpisode,
            animepahe: animepaheResult
                ? { session: animepaheResult.session, title: animepaheResult.title }
                : { session: "#", title: "Unknown" }
        });
    }

    return mappedResults;
}

// ======================Thriller====================== //

// ✅ Step 1: Query AniList API for Trending Anime
async function getThrillerAnime() {
    const query = `
        query {
            Page(perPage: 10) { 
                media(sort: POPULARITY_DESC, type: ANIME, genre: "Thriller") {
                    id
                    type
                    duration
                    season
                    seasonYear
                    format
                    status
                    episodes
                    title {
                        romaji
                        english
                        native
                    }
                    coverImage {
                        extraLarge
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(ANILIST_GRAPHQL_URL, { query });
        return response.data.data.Page.media;
    } catch (error) {
        console.error("Error fetching trending anime from AniList:", error);
        return [];
    }
}

// ✅ Step 2: Search AnimePahe by AniList ID
async function searchAnimePaheThriller(anilistId, title) {
    try {
        const response = await axios.get(`${ANIMEPAHE_SEARCH_URL}?m=search&l=8&q=${encodeURIComponent(title)}`, { headers });
        const results = response.data.data;

        if (!results || results.length === 0) {
            return null;
        }

        // Find anime with matching AniList ID
        return results.find(anime => anime.anilist_id === anilistId) || results[0]; // Fallback to first result
    } catch (error) {
        console.error(`Error searching AnimePahe for ${title}:`, error);
        return null;
    }
}

// ✅ Step 3: Map AniList to AnimePahe
async function mapAniListToAnimePaheThriller() {
    const thrillerAnime = await getThrillerAnime();
    let thrillerResults = [];

    for (const anime of thrillerAnime) {
        const { id, title } = anime;
        const searchTitle = title.romaji || title.english || title.native;
        const animeCover = anime.coverImage.extraLarge;
        const season = `${anime.season} ${anime.seasonYear}`;
        const duration = `${anime.format} ${anime.duration}mins`;
        const format = anime.format;
        const status = anime.status;
        const episodes = anime.episodes;

        const animepaheResult = await searchAnimePaheThriller(id, searchTitle);

        thrillerResults.push({
            anilist_id: id,
            anilist_title: searchTitle,
            anilist_cover: animeCover,
            season,
            duration,
            format,
            status,
            episodes,
            animepahe: animepaheResult
                ? { session: animepaheResult.session, title: animepaheResult.title }
                : { session: "#", title: "Unknown" }
        });
    }

    return thrillerResults;
}

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});