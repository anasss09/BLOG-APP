import User from '../models/user.model.js';

export const postRegister = async (req, res) => {
    try {
        if (!req.body) {
            return res.send("Fill the requirements!");
        }

        const { fullName, email, password } = req.body;

        const requiredFields = ['fullName', 'email', 'password'];
        const incomingFields = Object.keys(req.body);
        const missingFields = requiredFields.filter((field) => !incomingFields.includes(field));

        if (missingFields.length > 0) {
            return res.status(401)
                .json({
                    success: false,
                    message: `fill the ${missingFields.join(",")} fields`,
                })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400)
                .json({
                    success: false,
                    message: `User Already exist !!`,
                })
        }


        const user = await User.create({
            fullName,
            email,
            password
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).
            json({
                success: true,
                message: `User register successfully.`,
                user: userObj
            })


    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: `Error in Register ${error}`,
            })
    }
}

async function generateJWTtokens(email) {

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404)
                .json({
                    success: false,
                    message: `User not found`,
                });
        }

        const accessToken= user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        return { accessToken, refreshToken };

    } catch (error) {
        console.log(`Error in generating tokens ${error}`);
    }
}

export const postLogin = async (req, res) => {
    try {
        if (!req.body) {
            return res.json({
                success: false,
                message: `Fill the crediancial`
            })
        }

        const { email, password } = req.body;

        const requiredFields = ['email', 'password'];
        const incomingFields = Object.keys(req.body);
        const missingFields = requiredFields.filter((field) => !incomingFields.includes(field));

        if (missingFields.length > 0) {
            return res.status(401)
                .json({
                    success: false,
                    message: `fill the ${missingFields.join(",")} fields`,
                })
        }

        const user = await User.findOne({ email });
        // console.log(user);

        if(!user) {
            return res.status(404)
                .json({
                    success: false,
                    message: `Account not found`,
                })
        }

        const isPasswordMatched = await user.isPasswordCorrect(password);

        if(!isPasswordMatched) {
            return res.status(401)
                .json({
                    success: false,
                    message: `Invalid Password`,
                });
        }

        const { accessToken, refreshToken } = await generateJWTtokens(email);

        user.refreshToken = refreshToken;
        await user.save();


        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;


        return res.status(200)
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: false,
            // sameSite: 'lax',
            secure: true,
            sameSite: 'none'
        }).cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: false,
            // sameSite: 'lax',
            secure: true,
            sameSite: 'none'
        }).json({
            success: true,
            message: `Login Successfully`,
            user: userObj
        });
    } catch (error) {
        // console.log(error);
        return res.status(500)
                .json({
                    success: false,
                    message: `Error in Login: ${error}`,
                });
    }
}

export const getLogout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const user = await User.findOne({ refreshToken });
        if(!user) {
            return res.status(404)
                .json({
                    success: false,
                    message: `User not found`,
                });
        }

        user.refreshToken = "";
        await user.save();

        return res.status(200)
            .clearCookie("refreshToken", {
                httpOnly: true,
                // secure: false,
                // sameSite: 'lax',
                secure: true,
                sameSite: 'none'
            })
            .clearCookie("accessToken", {
                httpOnly: true,
                // secure: false,
                // sameSite: 'lax',
                secure: true,
                sameSite: 'none'
            })
            .json({
                success: true,
                message: `Logout Successfully`,
            });
            
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: `Error in Logout: ${error}`,
            });
    }
}

export const getCheckAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};