const UserModel = require('../models/baseschemas/user-baseschema/model')
const systemUserModel = require('../models/systemUser/model')
// const accessCodesModel = require('../models/Accesscodes/model')
const Pallet = require('../models/createPallet/model');

var bcrypt = require('bcryptjs');

exports.getaccesspage = (req, res) => {
    console.log(req.body)
    res.render('getaccesscode.ejs', { message: null })
}

exports.validateOtp = (req, res) => {
    console.log(req.body)
    res.render('validateotp.ejs', { message: null })
}

exports.checkOtpIsValid = (req, res) => {
    if (req.body.otp === '1234') {
        res.status(200).json({ success: true, message: 'authenticated' })
    } else {
        res.render('validateotp.ejs', { message: 'Enter valid OTP' })
    }
}


exports.authenticate = async (req, res) => {
    try {
        console.log("_____________aith", req.params)
        const { email } = req.params;
        const getUserDetails = await UserModel.findOne({ Email: email, Inactive: true, Deleted: false })

        if (getUserDetails !== null) {
            const { Email, FirstName } = getUserDetails;
            const cookieValue = { Email, FirstName }

            //Generate cookie with expiration time
            res.cookie('auth_user', JSON.stringify(cookieValue), { maxAge: 1 * 24 * 3600000 });

            res.status(200).json({ success: true, message: 'You are authenticated, Now you can access the data' })
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// exports.validateAccessCode = async (req, res) => {
//     try {
//         // console.log("_____________aith", req.body)
//         const { accesscode, url, currentDate } = req.body;
//         const urls = 'http://' + req.cookies.redirect_url;
//         let palletId = null
//         if (req.cookies.redirect_url === '') {
//             res.redirect(urls)
//             return
//         } else {
//             const cookieUrl = req.cookies.redirect_url;
//             const palletNumber = cookieUrl.split('/')[3]
//             if (palletNumber) {
//                 palletId = palletNumber
//             } else {
//                 palletId = null
//             }
//         }

//         console.log(req.cookies.redirect_url)
//         const getAccessCodeAgreeData = await accessCodesModel.aggregate([
//             {
//                 $group: { _id: '$startDate' }
//             }
//         ])
//         const palletData = await Pallet.findOne({ _id: palletId, Deleted: false }).populate([
//             { path: 'Lot', model: 'Lot', populate: { path: 'ShippingInstruction', model: 'ShippingInstruction', populate: { path: 'Buyer', model: 'Buyer' } } },
//             { path: 'Factory', model: 'Factory', populate: { path: 'FctyCountry', model: 'Country' } }])
//         if (palletData == null) {
//             res.redirect(urls)
//             return
//         }
//         const getAccessCodeData = await accessCodesModel.findOne({ AccessCode: accesscode, inactive: false, Deleted: false })
//         console.log("_______________-", palletData, getAccessCodeData)
//         if (getAccessCodeData !== null) {

//             if (getAccessCodeData.type === 'Buyer') {
//                 if (palletData.Lot.ShippingInstruction.Buyer.country !== getAccessCodeData.Region || palletData.Factory._id !== getAccessCodeData.Factory || palletData.Lot.ShippingInstruction.Buyer._id !== getAccessCodeData.Buyer) {
//                     res.render('getaccesscode.ejs', { message: 'invalid access code' })
//                     return;
//                 }
//             }

//             if (getAccessCodeData.type === 'Factory') {
//                 if (palletData.Factory._id !== getAccessCodeData.Factory) {
//                     res.render('getaccesscode.ejs', { message: 'invalid access code' })
//                     return;
//                 }
//             }

//             const { startDate } = getAccessCodeData;
//             console.log(new Date(startDate) >= new Date(currentDate))
//             if (new Date(currentDate) >= new Date(startDate)) {
//                 res.cookie('access_code', JSON.stringify(getAccessCodeData), { maxAge: 3600000 });
//                 res.redirect(urls)
//             } else {
//                 res.render('getaccesscode.ejs', { message: 'Invalid access code' })
//             }

//         } else {
//             res.render('getaccesscode.ejs', { message: 'Invalid access code' })
//         }
//     } catch (error) {
//         res.render('getaccesscode.ejs', { message: error.message })
//     }
// }

exports.authenticateSystem = async (req, res) => {
    try {
        res.render('authpage.ejs', { message: null })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.createSystemUser = async (req, res) => {
    try {
        const { userId, password } = req.body;
        let findExistUser = await systemUserModel.findOne({ userId: userId });
        if (findExistUser) {
            res.status(200).json({ success: true, message: `User already exits with same user id : ${userId}`, errors: null })
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            const userToCreate = {
                userId: userId,
                password: hash
            }

            console.log("creates_________user_______", userToCreate)
            let createUser = await systemUserModel.create(userToCreate);

            res.status(201).json({ success: true, message: 'Successfully user created', errors: null })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.loginSystemClientUser = async (req, res) => {
    try {
        const { userId, password } = req.params;
        const urls = 'http://' + req.cookies.redirect_url;
        let findExistUser = await systemUserModel.findOne({ userId: userId });
        if (findExistUser) {
            const passwordMatch = bcrypt.compareSync(password, findExistUser?.password);
            if (passwordMatch) {
                res.cookie('auth_user', JSON.stringify(findExistUser), { maxAge: 1 * 24 * 3600000 });
                res.status(200).json({ success : true , message: 'Authenticated successfully'})
            } else {
                res.status(401).json({ success: false, message: 'Invalid Password' })
            }

        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.loginSystemUser = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const urls = 'http://' + req.cookies.redirect_url;
        let findExistUser = await systemUserModel.findOne({ userId: userId });
        if (findExistUser) {
            const passwordMatch = bcrypt.compareSync(password, findExistUser?.password);
            if (passwordMatch) {
                res.cookie('auth_user', JSON.stringify(findExistUser), { maxAge: 1 * 24 *3600000 });
                // res.cookie('auth_user', JSON.stringify(findExistUser), { maxAge: 36000 });
                res.redirect(urls)
            } else {
                res.render('authpage.ejs', { message: 'Invalid password' })
            }

        } else {
            res.render('authpage.ejs', { message: 'User details not found with the userid' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

exports.forgotSystemUserPassword = async (req, res) => {
    try {
        const { userId } = req.body;
        let findExistUser = await systemUserModel.findOne({ userId: userId });
        if (findExistUser) {
            // const passwordMatch = bcrypt.compareSync(password, findExistUser?.password);
            // if (passwordMatch) {
            //     res.cookie('auth_user', JSON.stringify(findExistUser), { maxAge: 36000 });
            //     res.render('getaccesscode.ejs', { message: null })
            // } else {
            //     res.status(401).json({ success: true, message: 'Invalid password' })
            // }

        } else {
            res.status(401).json({ success: true, message: 'User details not found with the userid' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}