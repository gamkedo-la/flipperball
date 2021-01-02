//CollisionBody.js
// eslint-disable-next-line no-unused-vars
function CollisionBody (data) {
    const buildCircleBody = function (self, data) {
        self.type = BodyType.Circle;
        self.name = data.name;
        self.radius = (data.width + data.height) / 4; //average of half the width and half the height
        self.center = {x:data.x + self.radius, y:data.y + self.radius};
    }

    const buildPolygonBody = function (self, data) {
        self.type = BodyType.Polygon;
        self.name = data.name;
        self.edges = [];
        for (let i = 1; i <= data.polygon.length; i++) {
            const start = data.polygon[i - 1];
            const end = (i === data.polygon.length ? data.polygon[0] : data.polygon[i]);
            self.edges.push(new Edge(start, end, data.x, data.y));
        }
    }

    if (data.ellipse) {
        buildCircleBody(this, data);
    } else if (data.polygon) {
        buildPolygonBody(this, data);
    }

    this.draw = function () {
        if(!DEBUG) {return;}
        if(this.type === BodyType.Circle) {drawCircleBody(this.center, this.radius);}
        if(this.type === BodyType.Polygon) {drawPolygonBody(this.edges);}
    }

    const drawCircleBody = function (center, radius) {
        canvasContext.save();
        canvasContext.strokeStyle = Color.Red;
        canvasContext.beginPath();
        canvasContext.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        canvasContext.stroke();
        canvasContext.restore();
    }

    const drawPolygonBody = function(edges) {
        canvasContext.save();
        canvasContext.strokeStyle = Color.Red;
        canvasContext.beginPath();

        canvasContext.moveTo(edges[0].start.x, edges[0].start.y);
        for (const edge of edges) {
            canvasContext.lineTo(edge.end.x, edge.end.y);
        }
        canvasContext.closePath();

        canvasContext.stroke();
        canvasContext.restore();
    }
}

function Edge (start, end, x, y) {
    this.start = {x: start.x + x, y: start.y + y};
    this.end = {x: end.x + x, y: end.y + y};
    this.deltaX = end.x - start.x;
    this.deltaY = end.y - start.y;
    this.length = Math.sqrt((this.deltaX * this.deltaX) + (this.deltaY * this.deltaY));
    this.normalDeltaX = this.deltaY;
    this.normalDeltaY = -this.deltaX;
}