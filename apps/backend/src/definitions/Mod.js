class Mod {
    constructor(data = {}){
        this.id = data.id;
        this.creatorID = data.creatorID;
        this.name = data.name ?? data.modName ?? "Unnamed Mod";
        this.pageID = data.pageID ?? data.modPage ?? `${query}_mod`;
    }
}

module.exports = {Mod};