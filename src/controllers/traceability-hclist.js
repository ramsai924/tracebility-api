//*****This is used to TraceabilityAPI Live */
const ShippingInstruction = require('../models/shippingInstruction/model');
const Lot = require('../models/lot/model')
const Buyer = require('../models/buyer/model')
exports.getSIWithHCContractList = async (req, res) => {
  try {
    // let pickingDetails = [];

    const query = req.query;
    const checkKeys = Object.keys(query)
    
    if (checkKeys.length === 0){
      return res.status(400).json({ success: false, message: 'Keys is missing, Please provide keys year or lastupdateddate' });
    }

    const { year, lastupdateddate } = req.query;
    

    let siData = []
    
    if (year == '' && checkKeys.some((k) => k === 'year')) {
      return res.status(400).json({ success: false, message: 'Year is missing' });
    } else if (year !== '' && year !== undefined){
      siData = await ShippingInstruction.find({ Deleted: false, "$expr": { "$eq": [{ "$year": "$Date" }, Number(year)] } }).populate(['Factory', 'Buyer', 'Destination', 'PackingType', 'ProductGrade']);
    }

    if (lastupdateddate == '' && checkKeys.some((k) => k === 'lastupdateddate')){
      return res.status(400).json({ success: false, message: 'Last updated Date is missing' });
    } else if (lastupdateddate !== '' && lastupdateddate !== undefined){
      const lastupdateddates = new Date(lastupdateddate);
      const dateValue = lastupdateddates.getFullYear();

      if (isNaN(dateValue)){
        return res.status(400).json({ success: false, message: 'Please provide valide date' });
      }

      const dateSelected = new Date(lastupdateddates);
      const getYear = dateSelected.getFullYear()
      const getMonth = dateSelected.getMonth()
      const getDate = dateSelected.getDate()
      const startDate = new Date(Date.UTC(getYear, getMonth, getDate , 0, 0, 0))
      console.log('lastupdateddates', startDate)
      siData = await ShippingInstruction.find({ Deleted: false, LastUpdatedAt: { $gte: startDate.toISOString()  } }).populate(['Factory', 'Buyer', 'Destination', 'PackingType', 'ProductGrade']);
    }



    
    console.log(siData.length)

    let pickingDetails = []

    if (siData.length > 0){
      for(const si of siData){
        let obj = {};
        obj.si_numb = si.SINo;
        obj["buyer_ref_numb"] = si?.BuyerRef ? si?.BuyerRef : '';
        // obj.hc_contract_number = si.BrokerContract;
        obj["factory_cd"] = si.Factory ? si.Factory.FctyCode : '';
        // obj["factory_nm"] = si.Factory ? si.Factory.FctyName : '';
        // obj["factory_lat"] = si.Factory ? si.Factory.FctyLat.toString() : '';
        // obj["factory_long"] = si.Factory ? si.Factory.FctyLng.toString() : '';
        obj["contract_numb"] = si?.Contract ? si?.Contract : '';
        // obj["si_destination"] = si.Destination ? si.Destination.Destination : ''
        // obj["si_port_of_shipment"] = si.PortOfShipment
        obj["contract_buyer_nm"] = si.Buyer ? si.Buyer.name : ''
        obj["grade_nm"] = si.ProductGrade ? si.ProductGrade.GradeName.toUpperCase() : '';
        // obj["packing_typ_nm"] = si.PackingType ? si.PackingType.PckTypeName.toUpperCase() : '';
        obj["weight"] = si.Weight;
        obj["delivery_datetime"] = si?.ShipDate
        const lotData = await Lot.find({ ShippingInstruction: si._id, Deleted: false })
        const lotsum = lotData.reduce((a,b) => a + Number(b.LotWeight),0)
        // console.log('lotData__', lotsum)
        obj["balance_qty"] = si?.Weight - lotsum
        obj["est_time_departure"] = si?.ETD ? new Date(si?.ETD) : ''
        obj["plan_cargo_ready_date"] = si?.CargoReadyDate ? new Date(si?.CargoReadyDate) : null
        obj["plan_shipped_date"] = si?.ActualShippedDate ? new Date(si?.ActualShippedDate) : null
        // obj["weight"] = si.Weight;
        // obj["delivery_datetime"] = si?.ActualShippedDate

        //need to add plan shipped date and cargo ready shipped date
        pickingDetails.push(obj)
      }
    }else{
      pickingDetails = []
    }
    
    res.status(200).json({ Recordcount: pickingDetails.length,info: pickingDetails });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err,
      data: null,
      errors: [{ propertyName: 'Server', error: 'Server Error' }],
    });
  }
};
