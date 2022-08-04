const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const should = chai.should();

chai.use(chaiHttp);

describe("Distance Form", () => {
    it("should redirect user to login on GET /new-distance-form", async() => {
        var agent = chai.request.agent(server);
        agent
            .get("new-distance-playlist")
            .then((res) => {
                res.should.have.status(303);
                res.should.redirectTo(/^[\s\S]*\/login$/);
            });
        agent.close();
    })

    it("should present distance form on GET /new-distance-form", async() => {
        var userInfo = {
            f_uname: "appTester123",
            f_pwd: "testpwd123",
        }

        var agent = chai.request.agent(server);
        agent
            .post("/verify-login")
            .send(userInfo)
            .then((res) => {
                res.should.have.cookie("persongify_auth");
                res.should.have.status(200);

                return agent
                    .get("/new-distance-playlist")
                    .then((res) => {
                        res.should.have.status(200);
                    })
            });
        agent.close();
    })
})

describe("Generating Distance Calcs", () => {
    it("should return distance calc object on POST /distance-playlist", async() => {
        var userInfo = {
            f_uname: "appTester123",
            f_pwd: "testpwd123",
        }

        var agent = chai.request.agent(server);
        agent
            .post("/verify-login")
            .send(userInfo)
            .then((res) => {
                res.should.have.cookie("persongify_auth");
                res.should.have.status(200);

                var locInfo = {
                    f_travel_mode: "driving",
                    f_orig_city: "Vancouver",
                    f_orig_province: "BC",
                    f_dest_city: "Seattle",
                    f_dest_province: "WA",
                    f_artist: "VIC MENSA",
                    f_song: "Liquor Locker",
                    f_genre: 'hip-hop',
                }

                return agent
                    .post("/distance-playlist")
                    .send(locInfo)
                    .then((res) => {
                        res.body.should.be.json;
                        res.should.have.status(200);
                    })
            });
        agent.close();
    })

    it("should be less than the playlist length on POST /distance-playlist", async() => {
        var userInfo = {
            f_uname: "appTester123",
            f_pwd: "testpwd123",
        }

        var agent = chai.request.agent(server);
        agent
            .post("/verify-login")
            .send(userInfo)
            .then((res) => {
                res.should.have.cookie("persongify_auth");
                res.should.have.status(200);

                var locInfo = {
                    f_travel_mode: "driving",
                    f_orig_city: "Vancouver",
                    f_orig_province: "BC",
                    f_dest_city: "Seattle",
                    f_dest_province: "WA",
                    f_artist: "VIC MENSA",
                    f_song: "Liquor Locker",
                    f_genre: 'hip-hop',
                }

                return agent
                    .post("/distance-playlist")
                    .send(locInfo)
                    .then((res) => {
                        res.body.map(target_len).should.all.be.below(total_len);
                    })
            });
        agent.close();
    })
})
// TODO: check if user is given option to save playlist