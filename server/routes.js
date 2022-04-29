const router = require("express").Router();
const { body } = require("express-validator");

const { discordVerify } = require("./controllers/discordVerifyController");
const { roleSetting } = require("./controllers/discordRoleSettingController");
const {
    signUpWhitelist,
    signUpWhitelistManually,
} = require("./controllers/signUpWhitelistController");
const { checkUser } = require("./controllers/checkUserController");
const {
    checkMintable,
    getMintData,
    getTotalMintedCount
} = require("./controllers/HGMintController");
const { checkBalance } = require("./controllers/checkBalanceController");
router.post("/api/checkUser", [body("address")], checkUser);
router.post("/api/discordVerify", [body("discordUserName")], discordVerify);
router.post("/api/roleSetting", [body("discordUserName")], roleSetting);
router.post(
    "/api/signupwhitelist",
    [body("address", "discordUserName")],
    signUpWhitelist
);
router.post(
    "/api/signupwhitelistmanually",
    [body("address")],
    signUpWhitelistManually
);
router.get("/api/test", function (request, response) {
    response.send("Server is running");
});

router.post("/api/checkMintable", [body("address")], checkMintable);
router.post("/api/checkBalance", [body("address", "count")], checkBalance);
router.post("/api/getMintData", [body("address", "count")], getMintData);
router.get("/api/getTotalMintCount", getTotalMintedCount);

module.exports = router;
