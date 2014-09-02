/*
 ====================
 canvas setup for drawing tiles
 ====================
 */

 function CanvasTileLayer(canvas_setup, render) {
    this.tileSize = new google.maps.Size(256, 256);
    this.maxZoom = 19;
    this.name = "Tile #s";
    this.alt = "Canvas tile layer";
    this.tiles = {};
    this.canvas_setup = canvas_setup;
    this.render = render;
    if (!render) {
        this.render = canvas_setup;
    }
}


// create a tile with a canvas element
CanvasTileLayer.prototype.create_tile_canvas = function (coord, zoom, ownerDocument) {

    // create canvas and reset style
    var canvas = ownerDocument.createElement('canvas');
    var hit_canvas = ownerDocument.createElement('canvas');
    canvas.style.border = hit_canvas.style.border = "none";
    canvas.style.margin = hit_canvas.style.margin = "0";
    canvas.style.padding = hit_canvas.style.padding = "0";

    // prepare canvas and context sizes
    var ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    var hit_ctx = hit_canvas.getContext('2d');
    hit_canvas.width = hit_ctx.width = this.tileSize.width;
    hit_canvas.height = hit_ctx.height = this.tileSize.height;

    //set unique id
    var tile_id = coord.x + '_' + coord.y + '_' + zoom;

    canvas.setAttribute('id', tile_id);
    hit_canvas.setAttribute('id', tile_id);

    if (tile_id in this.tiles)
        delete this.tiles[tile_id];

    this.tiles[tile_id] = {canvas:canvas, ctx:ctx, hit_canvas:hit_canvas, hit_ctx:hit_ctx, coord:coord, zoom:zoom, primitives:null};

    // custom setup
    //if (tile_id == '19295_24654_16'){
    if (this.canvas_setup)
        this.canvas_setup(this.tiles[tile_id], coord, zoom);
    //}
    return canvas;

}


CanvasTileLayer.prototype.each = function (callback) {
    for (var t in this.tiles) {
        var tile = this.tiles[t];
        callback(tile);
    }
}

CanvasTileLayer.prototype.recreate = function () {
    for (var t in this.tiles) {
        var tile = this.tiles[t];
        this.canvas_setup(tile, tile.coord, tile.zoom);
    }
};

CanvasTileLayer.prototype.redraw_tile = function (tile) {
    this.render(tile, tile.coord, tile.zoom);
};

CanvasTileLayer.prototype.redraw = function () {
    for (var t in this.tiles) {
        var tile = this.tiles[t];
        this.render(tile, tile.coord, tile.zoom);
    }
};

// could be called directly...
CanvasTileLayer.prototype.getTile = function (coord, zoom, ownerDocument) {
    return this.create_tile_canvas(coord, zoom, ownerDocument);
};

CanvasTileLayer.prototype.releaseTile = function (tile) {
    var id = tile.getAttribute('id');
    delete this.tiles[id];
};
