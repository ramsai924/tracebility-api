const {
  getSILotPalletDetailForTraceability,
} = require('../src/controllers/traceability-report');
const {
  getSILotPalletForTraceability,
} = require('../src/controllers/traceability-format');
const {
  getSIWithHCContractList,
} = require('../src/controllers/traceability-hclist');
const {
  getaccesspage,
  authenticateSystem,
  validateOtp,
  checkOtpIsValid,
  // validateAccessCode,
  loginSystemClientUser,
  createSystemUser,
  loginSystemUser,
  forgotSystemUserPassword
} = require('../src/controllers/authenticate')

//Ramsai - added for authentication
const authenticateMiddileware = (req, res, next) => {

  const cookieData = req.cookies;
  const url = req.headers.host + `${req.url}`
  const cookiesKeys = Object.keys(cookieData)
  const findUrlFind = cookiesKeys.some((ck) => ck === 'redirect_url');
  console.log('cookies =====> ', cookieData, Object.keys(cookieData), url)
  if (Object.keys(cookieData).length > 1) {
    // res.status(401).json({ success: false, message: 'Unauthorized' })

    if (cookiesKeys.length == 2) {
      const filterAuthUser = cookiesKeys.some((ck) => ck === 'auth_user');
      if (filterAuthUser) {
        console.log('findauth find')
        next()
      } else {
        console.log('authpage not found')
        res.render('authpage.ejs', { message: 'Authenticate to access data', url: url })
      }
    }else{
      res.render('authpage.ejs', { message: 'Authenticate to access data', url: url })
    }
    // res.render('getaccesscode.ejs', { message: 'Please authenticate to access the data' })
  } else {
    res.cookie('redirect_url', url, { maxAge: 3600000 });
    res.render('authpage.ejs', { message: 'Authenticate to access data', url: url })
  }
}

const authenticateMiddilewareClinet = (req, res, next) => {
  const cookieData = req.cookies;
  const url = req.headers.host + `${req.url}`
  const cookiesKeys = Object.keys(cookieData)
  const filterAuthUser = cookiesKeys.some((ck) => ck === 'auth_user');
  if (filterAuthUser) {
    console.log('findauth find')
    next()
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized'})
  }
}

module.exports = function (app) {
  app
    .route('/Reports/Traceability/:factoryCode/:year/:PickingId/:Option/debug')
    .get(getSILotPalletDetailForTraceability);

  //Add authentication
  app
    .route('/Reports/Traceability/:factoryCode/:year/:PickingId/:Option')
    //.get(getSILotPalletForTraceability);
    .get(authenticateMiddilewareClinet, getSILotPalletForTraceability);
  app
    .route('/Reports/Traceability/:factoryCode/:year/:PickingId/:Option/:userType')
    .get(authenticateMiddileware, getSILotPalletForTraceability);
  app
    .route('/Reports/Traceability/si_hc_contract_list/:userType')
    .get(authenticateMiddileware, getSIWithHCContractList);
  app
    .route('/Reports/Traceability/si_hc_contract_list')
    // .get(getSIWithHCContractList);
    .get(authenticateMiddilewareClinet, getSIWithHCContractList);

  app.route('/authenticate-system').get(authenticateSystem);
  app.route('/system-user-register').post(createSystemUser);
  app.route('/system-user-login').post(loginSystemUser);
  app.route('/system-user-forgot-password').post(forgotSystemUserPassword);
  app.route('/authenticate/:userId/:password').get(loginSystemClientUser)

};
