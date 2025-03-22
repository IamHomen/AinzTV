const express = require("express");
const axios = require("axios");
const path = require("path");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
// ✅ Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // ✅ Ensure views are loaded from 'views/' folder

// Serve static files (CSS, JS, images)
app.use(express.static(__dirname + "/public"));

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

// 🌟 Fetch anime details and render anime.ejs
app.get("/anime/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cacheKey = `anime-${id}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            return res.render("anime", { animeData: cachedData });
        }

        // ✅ Fetch Anime Info
        const url = `${ANIMEPAHE_BASE_URL}/anime/${id}`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
            "Referer": ANIMEPAHE_BASE_URL,
            "Accept-Language": "en-US,en;q=0.9",
            "Cookie": "__ddgid_=uvwe8pkY9vVMTdG0; __ddg2_=Het8LdaILfm0B2E8; __ddg1_=MOiywMi3RBLrrGLZtxcS; res=1080; aud=jpn; av1=0; latest=5667; ann-fakesite=0; __ddg9_=110.54.144.240; __ddg10_=1742379866; __ddg8_=RkelUegxikezVZUS; XSRF-TOKEN=eyJpdiI6Ing2SkFTMWlzNy8yd1BkWlloNEY3bWc9PSIsInZhbHVlIjoiMG9KaFFQYjFTSDRTWUpSWlZpaVRkLzU1KzJzNFdGQlNZNGpOQjdISjAxYjBDWnJDalROZWI4MUZzcUs2Q3hnTDR5a1lpMi9pR05xbHBqc3FxbXFuRS9sNWpTd3UwZkdsMTRCNzN0WFFGL1E0M2tuYlF6VHkvY1NTK0tzQ29SZEMiLCJtYWMiOiJlMzhhMmJhNDQyOWRmYmMyMDYwNWE3ODAwYzExZGE3ZTI4OWIzMzE4Nzk3NWU1YTY0ZWEyYmUwN2FkM2I4NGZiIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IlBSU0NyR0hMVnR0OEtSdGptdUZ4OWc9PSIsInZhbHVlIjoiY1I4NzRLVUIrL2x6b1U5b29FLzU1bUdCemlzK0RGMENBT0hzbXNCNHF6eGV1cmZTRmMwZ3V2bHluOEVNOVFJVkNxU3FGS0sxNjZyUG9xcStNNzROSUMvUTc3K1pYdlcyTHNCZjBaQ1Z2RjFWQzZ6c0N2M2Rza0FLaUpIckVVS3YiLCJtYWMiOiI5ZWI1OGZiY2E3ZjZhMmNlYWQ2Mzk5MDJmMGM4YTkxNDUyZmUwOTQ0YmJjMGRhNjVmNGQwZTBkYTFhZjY4OWMxIiwidGFnIjoiIn0%3D",
        };

        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        const animeData = {
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

        //Fetch Relation
        $('div.anime-relation .col-sm-6').each((i, el) => {
            animeData.relations.push({
                id: $(el).find('.col-2 > a').attr('href')?.split('/')[2],
                title: $(el).find('.col-2 > a').attr('title'),
                image: $(el).find('.col-2 > a > img').attr('src') || $(el).find('.col-2 > a > img').attr('data-src'),
                url: `/anime/${$(el).find('.col-2 > a').attr('href')?.split('/')[2]}`,
                releaseDate: $(el).find('div.col-9 > a').text().trim(),
                type: $(el).find('div.col-9 > strong').text().trim(),
                relationType: $(el).find('h4 > span').text().trim(),
            });
        });

        // ✅ Fetch Recommendations
        $("div.anime-recommendation .col-sm-6").each((i, el) => {
            animeData.recommendations.push({
                id: $(el).find(".col-2 > a").attr("href")?.split("/")[2],
                title: $(el).find(".col-2 > a").attr("title"),
                image: $(el).find(".col-2 > a > img").attr("src") || $(el).find(".col-2 > a > img").attr("data-src"),
                url: `/anime/${$(el).find(".col-2 > a").attr("href")?.split("/")[2]}`,
                releaseDate: $(el).find("div.col-9 > a").text().trim(),
                type: $(el).find("div.col-9 > strong").text().trim(),
            });
        });

        // ✅ Fetch Episodes
        try {
            const episodeApiUrl = `${ANIMEPAHE_BASE_URL}/api?m=release&id=${id}&sort=episode_asc&page=1`;
            const { data } = await axios.get(episodeApiUrl, { headers });

            if (data && data.data) {
                data.data.forEach((ep) => {
                    animeData.episodes.push({
                        episodeNum: ep.episode,
                        episodeUrl: `/play/${id}/${ep.session}`,
                        episodeSnapshot: ep.snapshot,
                        episodeDuration: ep.duration,
                    });
                });
            }
        } catch (episodeError) {
            console.error("Error fetching episode data:", episodeError.message);
        }

        cache.set(cacheKey, animeData);
        res.render("anime", { animeData });
    } catch (error) {
        console.error("Error fetching anime info:", error.message);
        res.status(500).send("Failed to fetch anime data.");
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
