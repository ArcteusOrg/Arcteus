const { Mod } = require("../definitions/Mod")

module.exports = ((api) => {
    api.get("/mod", async (req,res) => {

        if(!checkValidRequest(req)){
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const query = req.query.modid ?? req.headers["x-mod-id"]
        if(query == null || query == undefined){
            return res.status(400).send("Missing Required Query/Header Parameter: Mod ID");
        }

        const cache = api.get("cache");
        const lookup = `modinfo:${query}`;
        if(cache.has(lookup)){
            return res.status(200).json({
                modID: query,
                modInfo: cache.get(lookup)
            })
        }
        //TODO: Lookup From DB
        const modInfo = new Mod({
            id: query,
            name: query.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(),
            pageID: `${query}_mod`
        }); // Stub Implementation
        cache.set(lookup,modInfo);
        return res.status(200).json({
            modID: query,
            modInfo: modInfo
        })
    });

    api.post("/mod",async (req,res) => {
        if(!checkValidRequest(req)){
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).send("Missing Required Body Parameter");
        }

        const modID = req.headers["x-mod-id"];
        if(modID == undefined || modID == null){
            return res.status(400).send("Missing Required Header Parameter: Mod ID");
        }
        if(body == null || body == undefined){
            return res.status(400).send("Malformed Data Sent");
        }
        const modInfo = new Mod(body);
        if(modInfo == undefined || modInfo.creatorID == undefined){
            return res.status(400).send("Malformed Data Sent");
        }
        if(modInfo.id == undefined){
            modInfo.id = modID;
        }
        console.log(JSON.stringify(modInfo));
        const lookup = `modinfo:${modID}`;
        api.get("cache").set(lookup,modInfo);
        console.log("Successfully Set ModInfo in Cache")
        //TODO: Upload Mod to DB
        return res.status(200).json({ message: "Successfully Uploaded Mod."})
    });

    api.delete("/mod", async (req,res) => {
        if(!checkValidRequest(req)){
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const creator = req.cookies.authToken;

        const query = req.query.modid ?? req.headers["x-mod-id"]
        if(query == null || query == undefined){
            return res.status(400).send("Missing Required Query/Header Parameter: Mod ID");
        }
        const cache = api.get("cache");
        const lookup = `modinfo:${query}`;
        //TODO: Remove from DB aswell
        if(cache.has(lookup)){
            const mod = await cache.get(lookup);
            if(mod.creatorID !== creator){
                console.log(mod.creatorID)
                return res.status(401).json({ error: 'Not authorized to perform this action' });
            }
            cache.delete(lookup);
            return res.status(200).json({message: "Successfully Deleted Mod"})
        }
        return res.status(404).json({message: `Could not find mod for id ${query}`})
    })

    function checkValidRequest(req){
        creatorID = req.cookies?.authToken;
        if(!creatorID){
            return false;
        }
        //TODO: Check Validity of ID
        return true;
    }
});