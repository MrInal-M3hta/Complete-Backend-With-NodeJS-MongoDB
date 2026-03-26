import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, changeCurrentPassword, getCurrentUser, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, updateAccountDetails, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

/*
Flow:
    Request → upload.fields() → registerUser
*/

router.route("/login").post(loginUser)
// Secure routes...
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router;

/*

There are two ways to define routes:

1) Chaining Style. [We have use this one in the code]
    router.route("/register").post(...)

✔ Good when you have multiple methods:
    router.route("/user")
    .get(getUser)
    .post(createUser)
    .put(updateUser)


2) Simple Style.
    router.post("/register", middleware, controller)

Example:
    router.post(
    "/register",
        upload.fields([
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 }
        ]),
        registerUser
    );

✔ Cleaner for single route
✔ Most commonly used

Simple Rules to Remember:
    router.METHOD(path, middleware, controller)

Example:
    router.post("/route", middleware, controller)

Note:
    If the user uploads only ONE file, you should use => upload.single("avatar")

    And use this in controller => req.file.path
*/
