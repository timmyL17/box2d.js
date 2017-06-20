let box2d = Box2D({
    ENVIRONMENT: "WEB"
});

// function to measure box2d memory usage
function checkMemory() {
    let ptrs = [];
    let total = 0;
    let counts = {};
    let count = 0;
    let size = 1024 * 1024;

    while (size >= 1) {
        try {
            ptrs.push(box2d._malloc(size));
            total += size;
            count++;

        } catch (e) {
            counts[size] = count;
            size /= 2;
            count = 0;
        }
    }

    try {
        for (var i in ptrs) {
            box2d._free(ptrs[i]);
        }
    } catch (e) {
        //console.logToUser(e);
    }

    //for (var s in counts) {
    //    console.logToUser(counts[s] + " of size " + s);
    //}
    return total;
}

let world = new box2d.b2World(new box2d.b2Vec2(0.0, -10.0));

let memStart = checkMemory();

for (let i = 0; i < 100; i++) {
    let tmp = new box2d.b2BodyDef();
    box2d.destroy(tmp);
}

let memEnd = checkMemory();

for (let i = 0; i < 100; i++) {
    let tmp = new box2d.b2BodyDef();
    let body = world.CreateBody(tmp);
    box2d.destroy(tmp);
    world.DestroyBody(body);
}

let memDestroyBodies = checkMemory();

for (let i = 0; i < 1000; i++) {
    let tmp = new box2d.b2BodyDef();
    let body = world.CreateBody(tmp);

    box2d.destroy(tmp);

    let shape = new box2d.b2CircleShape();
    shape.set_m_radius(1);
    const fixtureDef = new box2d.b2FixtureDef();
    fixtureDef.set_shape(shape);
    //let fix = body.CreateFixture(fixtureDef);
    body.CreateFixture(fixtureDef);

    box2d.destroy(shape);
    box2d.destroy(fixtureDef);

    world.Step(1.0/60.0, 3, 3);
    //body.DestroyFixture(fix);
    world.DestroyBody(body);
}

let memDestroyFixtures = checkMemory();

//var b2Body = world.GetBodyList();
//var items = 0;
//while(box2d.getPointer(b2Body)){
    //items++;
    //b2Body = b2Body.GetNext();
//}

//var count = world.GetBodyCount();

//document.getElementById('text').innerHTML = '<p style="font-family:\'Lucida Console\', monospace">mem start: ' + memStart.toString() + '<br>mem after body def destroy: ' + memEnd.toString() + '<br>mem after destroy bodies__: ' + memDestroyBodies.toString() +'<br>count: ' + count + ' | items: ' + items + '</p>';

document.getElementById('text').innerHTML = '<p style="font-family:\'Lucida Console\', monospace">mem start: ' + memStart.toString() + '<br>mem after body def destroy: ' + memEnd.toString() + '<br>mem after destroy bodies__: ' + memDestroyBodies.toString() + '<br>mem after destroy fixtures: ' + memDestroyFixtures.toString() +'</p>';

