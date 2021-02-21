/* eslint-disable no-continue */
/* eslint-disable max-depth */
//CollisionManager.js
// eslint-disable-next-line no-unused-vars
function CollisionManager () {
    this.balls = new Set();
    this.flippers = new Set();
    this.entities = new Set();
    this.plunger = null;
    this.collisions = [];

    this.registerBall = function(ball) {
        //x: 358.0000735, y: 237.817785
        this.balls.add(ball);
    }

    this.unregisterBall = function(ball) {
        this.balls.delete(ball);
    }

    this.registerFlipper = function(flipper) {
        this.flippers.add(flipper);
    }

    this.unregisterFlipper = function(flipper) {
        this.flippers.delete(flipper);
    }

    this.registerPlunger = function(plunger) {
        this.plunger = plunger
    }

    this.unregisterPlunger = function() {
        this.plunger = null
    }

    this.registerEntity = function (entity) {
        this.entities.add(entity);
    }

    this.unregisterEntity = function (entity) {
        this.entities.delete(entity);
    }

    this.checkBallFlipperCollisions = function() {
        for (const ball of this.balls.values()) {
            this.collisions.length = 0; //empty the collisions array
            for (const otherBall of this.balls.values()) {
                if (otherBall !== ball) {
                    const distance = squaredDistance(ball.body.center.x, ball.body.center.y, otherBall.body.center.x, otherBall.body.center.y);
                    if (distance <= ((ball.body.radius + otherBall.body.radius) * (ball.body.radius + otherBall.body.radius))) {
                        const direction = normalize(ball.center, otherBall.center);
                        this.collisions.push(new Collision(
                            COLLISION_TYPE.Circle,
                            otherBall,
                            otherBall.body,
                            Math.sqrt(distance) - otherBall.body.radius,
                            direction,
                            otherBall.center
                        ));
                    }
                }
            }

            if (this.plunger) {
                //check plunger collisions
                const distance = squaredDistance(ball.body.center.x, ball.body.center.y, this.plunger.body.center.x, this.plunger.body.center.y);
                const squaredRadii = (ball.body.radius + this.plunger.body.radius) * (ball.body.radius + this.plunger.body.radius);
                if (distance <= squaredRadii) {
                    const circleLine = circlePolygonCollision(ball, this.plunger);
                    if (circleLine && circleLine.length > 0) {
                        this.collisions.push(...circleLine);
                    }
                } 
            }

            for (const flipper of this.flippers.values()) {
                const tipDistance = squaredDistance(ball.body.center.x, ball.body.center.y, flipper.tipBody.center.x, flipper.tipBody.center.y);
                if (tipDistance <= ((ball.body.radius + flipper.tipBody.radius) * (ball.body.radius + flipper.tipBody.radius))) {
                    const direction = normalize(ball.center, flipper.tipBody.center);
                    this.collisions.push(new Collision(
                        COLLISION_TYPE.Circle,
                        flipper,
                        flipper.tipBody,
                        (ball.body.radius + flipper.tipBody.radius) - Math.sqrt(tipDistance),
                        direction,
                        flipper.tipBody.center
                    ));
                    break;
                }

                const baseDistance = squaredDistance(ball.body.center.x, ball.body.center.y, flipper.baseBody.center.x, flipper.baseBody.center.y);
                if (baseDistance <= ((ball.body.radius + flipper.baseBody.radius) * (ball.body.radius + flipper.baseBody.radius))) {
                    const direction = normalize(ball.center, flipper.baseBody.center);
                    this.collisions.push(new Collision(
                        COLLISION_TYPE.Circle,
                        flipper,
                        flipper.baseBody,
                        (ball.body.radius + flipper.baseBody.radius) - Math.sqrt(baseDistance),
                        direction,
                        flipper.baseBody.center
                    ));
                    break;
                }

                const distance = squaredDistance(ball.body.center.x, ball.body.center.y, flipper.body.center.x, flipper.body.center.y);
                const squaredRadii = (ball.body.radius + flipper.body.radius) * (ball.body.radius + flipper.body.radius);
                if (distance <= squaredRadii) {
                    const circleLine = circlePolygonCollision(ball, flipper);
                    if (circleLine && circleLine.length > 0) {
                        this.collisions.push(...circleLine);
                    }
                    break;
                }              
            }

            ball.resolveCollisions(this.collisions);
        }
    }

    this.checkCollisions = function (deltaTime) {
        for (const ball of this.balls.values()) {
            this.collisions.length = 0; //empty the collisions array
            for (const entity of this.entities.values()) {
                // const willCollide = ball.willCollideWith(entity, deltaTime);
                const distance = squaredDistance(ball.body.center.x, ball.body.center.y, entity.body.center.x, entity.body.center.y);
                const squaredRadii = (ball.body.radius + entity.body.radius) * (ball.body.radius + entity.body.radius);
                if (entity.type == ENTITY_TYPE.Gate && ball.velocity.x < 0) { continue;}
                if (distance <= squaredRadii) {
                    if (entity.type == ENTITY_TYPE.RotatingGate || entity.body.name == ENTITY_NAME.RotatingGate) {
                        //TODO: Add handling of rotating way collision
                        // console.log("CollisionManager: checkCollision: "+ entity.type);
                        const direction = normalize(ball.body.center, entity.body.center);
                        this.collisions.push(new Collision(
                            COLLISION_TYPE.Polygon,
                            entity,
                            entity.body,
                            Math.sqrt(distance) - entity.body.radius,
                            direction
                        ));
                    } else if (entity.body.type === BODY_TYPE.Circle) {
                        const direction = normalize(ball.body.center, entity.body.center);
                        this.collisions.push(new Collision(
                            COLLISION_TYPE.Circle,
                            entity,
                            entity.body,
                            entity.body.radius + ball.body.radius - Math.sqrt(distance),
                            direction
                        ));
                    } else {
                        const circleLine = circlePolygonCollision(ball, entity);
                        if (circleLine && circleLine.length > 0) {
                            this.collisions.push(...circleLine);
                        }
                    }
                }
            }
            ball.resolveCollisions(this.collisions);
        }
    }


    const squaredDistance = function (x1, y1, x2, y2) {
        return (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    }

    const circlePolygonCollision = function (circle, polygon) {
        const result = [];
        for (const edge of polygon.body.edges) {
            const coll = circleLineCollision(circle, edge);
            if (coll != null) {
                result.push(new Collision(COLLISION_TYPE.Polygon, polygon, edge, coll.dist, coll.dir, coll.point, edge));
            }
        }
        return result;
    }

    const circleLineCollision = function (circle, line) {
        const minusX = circle.body.center.x - circle.body.radius * line.normal.x;
        const minusY = circle.body.center.y - circle.body.radius * line.normal.y;

        const collision = lineLineCollision(
            circle.body.center.x, circle.body.center.y,
            minusX, minusY,
            line.start.x, line.start.y,
            line.end.x, line.end.y
        );

        if (collision !== null) {
            return {dist: collision.line1Dist * circle.body.radius, dir: line.normal, point: collision.point};
        } else {
            return null;
        }
    }

    const lineLineCollision = function(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        const denominator = ((line1EndX - line1StartX) * (line2EndY - line2StartY)) - ((line1EndY - line1StartY) * (line2EndX - line2StartX));
        const numerator1 = ((line1StartY - line2StartY) * (line2EndX - line2StartX)) - ((line1StartX - line2StartX) * (line2EndY - line2StartY));
        const numerator2 = ((line1StartY - line2StartY) * (line1EndX - line1StartX)) - ((line1StartX - line2StartX) * (line1EndY - line1StartY));
    
        if ((Math.abs(denominator) <= Number.EPSILON) && (Math.abs(numerator1) <= Number.EPSILON) && (Math.abs(numerator2) <= Number.EPSILON)) {
            //Need to check if touching end to end
            if ((Math.abs(line1StartX - line2StartX) <= Number.EPSILON) && (Math.abs(line1StartY - line2StartY))) {
                //line1Start v line2Start
                return 0;
            } else if((Math.abs(line1StartX - line2EndX) <= Number.EPSILON) && (Math.abs(line1StartY - line2EndY))) {
                //line1Start v line2End
                return 0;
            } else if((Math.abs(line1EndX - line2StartX) <= Number.EPSILON) && (Math.abs(line1EndY - line2StartY))) {
                //line1End v line2Start
                return 1;
            } else if((Math.abs(line1EndX - line2EndX) <= Number.EPSILON) && (Math.abs(line1EndY - line2EndY))) {
                //line1End v line2End
                return 1;
            } else {
                return null;
            }
        }
    
        const r = numerator1 / denominator;
        const s = numerator2 / denominator;
    
        if ((r >= 0 && r <= 1) && (s >= 0 && s <= 1)) {
            // r * line1 === s * line2
            const line1DeltaX = line1EndX - line1StartX;
            const line1DeltaY = line1EndY - line1StartY;
            return {line1Dist: r, line2Dist: s, point: {x: line1StartX + r * line1DeltaX, y: line1StartY + r * line1DeltaY}}
        } else {
            return null;
        }
    }

    const normalize = function(end, start) {
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        const magnitude = (Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)));
        if (magnitude <= Number.EPSILON) {
            return {x: 0, y: 0};
        } else {
            return {x: deltaX / magnitude, y: deltaY / magnitude};
        }
    }
}

function Collision (type, otherEntity, body, distance, direction, point = null, edge = null) {
    this.type = type;
    this.otherEntity = otherEntity;
    this.body = body;
    this.distance = distance;
    this.direction = direction;
    this.point = point;
    this.edge = edge;
}