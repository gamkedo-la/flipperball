//CollisionBody.js
// eslint-disable-next-line no-unused-vars
function CollisionBody (data) {
    const buildCircleBody = function (self, data) {
        self.type = BODY_TYPE.Circle;
        self.name = data.name;
        self.radius = (data.width + data.height) / 4; //average of half the width and half the height
        self.center = {x:data.x + self.radius, y:data.y + self.radius};
    }

    const buildPolygonBody = function (self, data) {
        self.type = BODY_TYPE.Polygon;
        self.name = data.name;
        self.edges = [];
        let minX = data.polygon[0].x;
        let maxX = data.polygon[0].x;
        let minY = data.polygon[0].y;
        let maxY = data.polygon[0].y;
        for (let i = 1; i <= data.polygon.length; i++) {
            const start = data.polygon[i - 1];
            const end = (i === data.polygon.length ? data.polygon[0] : data.polygon[i]);
            if (end.x < minX) {minX = end.x;}
            if (end.x > maxX) {maxX = end.x;}
            if (end.y < minY) {minY = end.y;}
            if (end.y > maxY) {maxY = end.y;}
            self.edges.push(new Edge(start, end, data.x, data.y));
        }

        const width = maxX - minX;
        const height = maxY - minY;
        self.radius = width > height ? width / 2 : height / 2;
        self.center = {x: data.x + minX + width / 2, y: data.y + minY + height / 2};
    }

    if (data.ellipse) {
        buildCircleBody(this, data);
    } else if (data.polygon) {
        buildPolygonBody(this, data);
    } else {
        console.log(`Some other type?`)
    }

    this.update = function (deltaX, deltaY) {
        this.center.x += deltaX;
        this.center.y += deltaY;
    }

    this.rotate = function (center, angle) {
        if (this.type === BODY_TYPE.Polygon) {
            for (const edge of this.edges) {
                edge.rotate(center, angle);
            }
        } else {
            //Need to rotate a single point (the center) here

        }
    }

    this.draw = function () {
        if(!DEBUG) {return;}
        if(this.type === BODY_TYPE.Circle) {drawCircleBody(this.center, this.radius);}
        if(this.type === BODY_TYPE.Polygon) {drawPolygonBody(this.edges);}
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
    this.rotation = 0;

    this.recalculate = function() {
        const deltaX = (this.end.x - this.start.x);
        const deltaY = (this.end.y - this.start.y);
        this.length = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    
        const normalX = deltaY / this.length;
        const normalY = -deltaX / this.length;
        this.normal = {x: normalX, y: normalY};
        this.reflectance = 0.75;//TODO: Need to override this default somehow
    }
    this.recalculate();

    this.rotate = function(center, angle) {
        if (Math.abs(angle) < Number.EPSILON) {
            this.start = {x: start.x + x, y: start.y + y};
            this.end = {x: end.x + x, y: end.y + y};
        } else if (Math.abs(this.rotation - angle) < Number.EPSILON) {
            return;
        } else {
            const deltaStartX = this.start.x - center.x;
            const deltaStartY = this.start.y - center.y;
            const deltaEndX = this.end.x - center.x;
            const deltaEndY = this.end.y - center.y;
    
            const startX = deltaStartX * Math.cos(angle - this.rotation) - deltaStartY * Math.sin(angle - this.rotation);
            const startY = deltaStartX * Math.sin(angle - this.rotation) + deltaStartY * Math.cos(angle - this.rotation);
            const endX = deltaEndX * Math.cos(angle - this.rotation) - deltaEndY * Math.sin(angle - this.rotation);
            const endY = deltaEndX * Math.sin(angle - this.rotation) + deltaEndY * Math.cos(angle - this.rotation);
    
            this.start.x = startX + center.x;
            this.start.y = startY + center.y;
            this.end.x = endX + center.x;
            this.end.y = endY + center.y;    
        }

        this.rotation = angle;
        this.recalculate();
    }
}