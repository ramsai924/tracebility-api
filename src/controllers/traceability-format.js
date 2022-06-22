//*****This is used to TraceabilityAPI Live */
//Michelle 210901: set all value to Upper Case
//Michelle 210901: set all Key to lower case and split with "_" example area_sub_district

//*==========================================*/
const mongoose = require('mongoose');
const Pallet = require('../models/createPallet/model');
const Lot = require('../models/lot/model');
const TestResult = require('../models/testResult/model');
const ShippingInstruction = require('../models/shippingInstruction/model');
const Shipping = require('../models/shipping/model');
const SPCData = require('../models/spcData/model');
const DryProcess = require('../models/dryProcess/model');
const HangingShed = require('../models/hangingShed/model');
const WetProcess = require('../models/wetProcess/model');
const StorageLocationDetail_WP = require('../models/wetProcess/sub-document/model');
const Procurement = require('../models/procurement/model');
const CountryGrade = require('../models/countrygrade/model');
const Country = require('../models/country/model');
const RLotAllocation = require('../models/rLotAllocation/model');
require('../models/buyer/model');
require('../models/destination/model');
require('../models/productGrade/model');
require('../models/packingType/model');
const hsMasterModel = require('../models/hsMaster/model');
const hsMasterDetails = require('../models/hsMaster-detail/model');
const storageLocationModel = require('../models/storageLocation/model');
const storageLocationDetailsModel = require('../models/storageLocation-detail/model');
require('../models/rLot/model');
require('../models/rLotAllocation/model');
const factoryModel = require('../models/factory/model');

exports.getSILotPalletForTraceability = async (req, res) => {
  try {
    console.log(req.params);
    let pickingDetails = {};
    let composition = {}; //michelle 210903 - keep composition outside of Info{}
    let blanket_data ={}; //michelle 211101 - keep composition outside of Info{}
    let pallets = [];
    let lots = [];
    let testResults = [];
    let factoryId = '';
    let prod_test_date = Object.freeze({});
    // let Factory = await Factory.find({ FctyCode: req.params.factoryCode });

    let caseOption = req.params.Option;

    switch (req.params.Option) {
//For Option SI --START--
      case 'SI':
        let siData = await ShippingInstruction.find({
          $and: [
            { SINo: req.params.PickingId },
            { $expr: { $eq: [{ $year: '$Date' }, Number(req.params.year)] } },
          ],
        }).populate([
          // path: 'Buyer Destination ProductGrade PackingType Factory',
          { path: 'Buyer', model: 'Buyer' },
          { path: 'Destination', model: 'Destination' },
          { path: 'ProductGrade', model: 'ProductGrade' },
          { path: 'PackingType', model: 'PackingType' },
          { path: 'Factory', model: 'Factory' },
        ]);

        // console.log('siddata ==========================>', siData);

        const siFilter = siData.filter(
          (si) => si.Factory.FctyCode === req.params.factoryCode
        );

        if (siFilter.length === 0) {
          return res.status(200).send({
            message: 'No data found',
            data: pickingDetails,
            error: null,
          });
        }

        const si = siFilter[0];

        // let siData = await ShippingInstruction.aggregate([
        //   {
        //     $match:  {$and: [
        //     { SINo: req.params.PickingId },
        //     { $expr: { $eq: [{ $year: '$Date' }, Number(req.params.year)] } },
        //   ]},
        //   },
        //   {
        //     $lookup : {
        //       from: 'Factory',
        //       localField: 'Factory',
        //       foreignField: '_id',
        //       as: 'factory_details'
        //     }
        //   },
        //   {
        //       "$addFields": {
        //           "factory_details": {
        //               "$arrayElemAt": [
        //                   {
        //                       "$filter": {
        //                           "input": "$factory_details",
        //                           "as": "comp",
        //                           "cond": {
        //                               "$eq": [ "$$comp.FctyCode", req.params.factoryCode ]
        //                           }
        //                       }
        //                   }, 0
        //               ]
        //           }
        //       }
        //   },
        //   {
        //     $lookup: {

        //     }
        //   }
        // ]);

        // console.log('SI------->', si);

        // const si = siData

        factoryId = si.Factory;
        // console.log('factoryId------->', factoryId);

        // pickingDetails['details'] = si;
        pickingDetails.factory_cd = si.Factory.FctyCode;
        pickingDetails.factory_nm = si.Factory.FctyName.toUpperCase();
        pickingDetails.factory_lat = si.Factory.FctyLat.toString();
        pickingDetails.factory_long = si.Factory.FctyLng.toString();
        pickingDetails.contract_numb = si.Contract;
        pickingDetails.si_numb = si.SINo;
        // pickingDetails.lot_numb = '';
        // pickingDetails.pallet_numb = '';
       // pickingDetails.si_destination_country = si.Destination.Destination.toUpperCase(); // Michelle 210903
        pickingDetails.si_destination = si.Destination.Destination.toUpperCase();
        pickingDetails.si_port_of_shipment = si.PortOfShipment.toUpperCase();
        pickingDetails.contract_buyer_nm = si.Buyer.name.toUpperCase();
        // pickingDetails.grade_cd = si.ProductGrade.GradeCode;
        pickingDetails.grade_nm = si.ProductGrade.GradeName.toUpperCase();
        pickingDetails.packing_typ_nm = si.PackingType.PckTypeName.toUpperCase();
        pickingDetails.weight = si.Weight;
        // pickingDetails.pallet_shipping_dt = si.Date;
        pickingDetails.pallet_shipping_dt = si.ShipDate;
        pickingDetails.pallet_stuffing_location = si.StuffingLocation; //this is objID

        let shipping = await Shipping.find({
          ShippingInstruction: mongoose.Types.ObjectId(si._id),
        });
        /* pickingDetails.StuffingDate =
          shipping.length > 0 ? shipping[0].Date : ''; */
        pickingDetails.pallet_stuffing_location =
          shipping.length > 0 ? shipping[0].StuffingLocation.Name.toUpperCase() : '';
        lotsData = await Lot.find({
          ShippingInstruction: mongoose.Types.ObjectId(si._id),
          Deleted: false,
        });
        lots = lotsData.map((result) => {
          return result.toObject();
        });

        pallets = await Pallet.find({
          $and: [
            { Deleted: false },
            {
              $or: [
                {
                  ShippingInstruction: mongoose.Types.ObjectId(si._id),
                },
                {
                  Lot: {
                    $in: lots.map((result) => {
                      return result._id;
                    }),
                  },
                },
              ],
            },
          ],
        }).populate('Lot');

        if (pallets.length === 0){
          res.status(200).send({
            message: 'No Pallets for this SI.',
            info: pickingDetails,
            error: 'No Pallets for this SI',
          });
        }

        const palletData = pallets.map((palletDetail) => {
          let palletDetailObj = {};
          palletDetailObj.SeqPallet = palletDetail.SeqPallet;
          palletDetailObj.Lot = palletDetail.Lot.LotNumber;
          return palletDetailObj;
        });

        let objData = {};

        palletData.forEach((ele) => {
          if (objData[ele.Lot] === undefined) {
            objData[ele.Lot] = [];
          }
          objData[ele.Lot].push(ele.SeqPallet);
        });
        pickingDetails.lots = objData;

        const SI_ProductionDates = pallets
          .map((p) => p.ProductionDate)
          .sort((a, b) => new Date(a) - new Date(b));
        const production_latDate =
          SI_ProductionDates[SI_ProductionDates.length - 1];

        // console.log('SI_prod====>', SI_ProductionDates);
        // console.log('productionLat=====>', production_latDate);

        const SI_testDates = pallets
          .map((pallet) => pallet.TestDate)
          .sort((a, b) => new Date(a) - new Date(b));

        pickingDetails.date = [
          {
            description: 'PRODUCTION DATE',
            begin_dt: SI_ProductionDates[0],
            end_dt: SI_ProductionDates[SI_ProductionDates.length - 2], // This need to be monitored If we do length-1 it adds +1 day to date
          },
          {
            description: 'TEST DATE',
            begin_dt: SI_testDates[0],
            end_dt: SI_testDates[SI_testDates.length - 1],
          },
        ];

        testResults = await TestResult.find(
          {
            Pallet: {
              $in: pallets.map((result) => {
                return result._id;
              }),
            },
          },
          {
            PO: 1,
            Mooney: 1,
            Dirt: 1,
            Ash: 1,
            PRI: 1,
            VM: 1,
            Nitrogen: 1,
          }
        );

        const testresult_PO_array = testResults.map(
          (tsPos) => typeof tsPos.PO === 'number' && tsPos.PO
        );

        const testresult_PRI_array = testResults.map(
          (tsPos) => typeof tsPos.PRI === 'number' && tsPos.PRI
        );
        const testresult_Dirt_array = testResults.map(
          (tsPos) => typeof tsPos.Dirt === 'number' && tsPos.Dirt
        );
        const testresult_Ash_array = testResults.map(
          (tsPos) => typeof tsPos.Ash === 'number' && tsPos.Ash
        );
        const testresult_Mooney_array = testResults.map(
          (tsPos) => typeof tsPos.Mooney === 'number' && tsPos.Mooney
        );
        const testResults_VM_array = testResults.map(
          (tsPos) => typeof tsPos.VM === 'number' && tsPos.VM
        );
        const testResults_nitrogen_array = testResults.map(
          (tsPos) => typeof tsPos.Nitrogen === 'number' && tsPos.Nitrogen
        );

       // pickingDetails.TestResults = [ //michelle 210901
        pickingDetails.test_results =[
         testResultAverage(
            testresult_PO_array,
            testresult_PRI_array,
            testresult_Dirt_array,
            testresult_Ash_array,
            testresult_Mooney_array,
            testResults_VM_array,
            testResults_nitrogen_array
          ),
          testResultMax(
            testresult_PO_array,
            testresult_PRI_array,
            testresult_Dirt_array,
            testresult_Ash_array,
            testresult_Mooney_array,
            testResults_VM_array,
            testResults_nitrogen_array
          ),
          testResultMin(
            testresult_PO_array,
            testresult_PRI_array,
            testresult_Dirt_array,
            testresult_Ash_array,
            testresult_Mooney_array,
            testResults_VM_array,
            testResults_nitrogen_array
          ),
        ];
        

        //Test results by lot
        const palletIds = pallets.map((pal) => pal._id);
        const testResultsData = await TestResult.find({
          Pallet: { $in: palletIds },
        }).populate({
          path: 'Pallet',
          model: 'Pallet',
          populate: {
            path: 'Lot',
            model: 'Lot',
          },
        });

        const objectlotNumbers = Object.keys(objData);
        const resultDAta = objectlotNumbers.map((ltNo) => {
          let objectResult = {};
          objectResult.lot_numb = ltNo;
          const dirtArray = [];
          const ashArray = [];
          const vmArray = [];
          const poArray = [];
          const priArray = [];
          const nitrogenArray = [];
          const mooneyArray = [];

          testResultsData.forEach((obj) => {
            if (obj.Pallet.Lot.LotNumber === ltNo) {
              dirtArray.push(obj.Dirt);
              ashArray.push(obj.Ash);
              vmArray.push(obj.VM);
              poArray.push(obj.PO);
              priArray.push(obj.PRI);
              nitrogenArray.push(obj.Nitrogen);
              mooneyArray.push(obj.Mooney);
            }
          });
          objectResult.dirt = Number ((
            dirtArray.reduce((acc, cur) => acc + cur, 0) / dirtArray.length
          ).toFixed(3));
          objectResult.ash = Number ((
            ashArray.reduce((acc, cur) => acc + cur, 0) / ashArray.length
          ).toFixed(2));
          objectResult.volatile_matter = Number ((
            vmArray.reduce((acc, cur) =>acc + cur, 0) / vmArray.length
          ).toFixed(2));
          objectResult.po_avg = Number ((
            poArray.reduce((acc, cur) => acc + cur, 0) / poArray.length
          ).toFixed(1));
          objectResult.po_min = Number (Math.min(...poArray)
            .toFixed(1));
            //.toString();
          objectResult.po_max = Number(Math.max(...poArray)
            .toFixed(1));
            //.toString();
          objectResult.pri = Number ((
            priArray.reduce((acc, cur) => acc + cur, 0) / priArray.length
          ).toFixed(1));
          objectResult.nitrogen = Number ((
            nitrogenArray.reduce((acc, cur) => acc + cur, 0) /
            nitrogenArray.length
          ).toFixed(2));
          objectResult.mooney = Number ((
            mooneyArray.reduce((acc, cur) => acc + cur, 0) / mooneyArray.length
          ).toFixed(1));

          return objectResult;
        });
        pickingDetails.test_results_by_lot = resultDAta;

        //Grade limits
        const gradeModelData = await CountryGrade.findOne({
          _id: si.ProductGrade.GradeCountryGrd,
        }).populate('Country');
        let gradeLimitObj = {};
        gradeLimitObj.grade_name = gradeModelData.CountryGrade.toUpperCase(); 
        gradeLimitObj.grade_commodity = gradeModelData.Commodity.toUpperCase();
        gradeLimitObj.producing_country = gradeModelData.Country.name.toUpperCase();

        gradeLimitObj.dirt = {
          value: gradeModelData.Dirt_Param,
          limit: gradeModelData.Dirt_Limit === 1 ? 'MAX' : 'MIN',
          test_method: gradeModelData.Dirt_TestMethod,
        };
        gradeLimitObj.ash = {
          value: gradeModelData.Ash_Param,
          limit: gradeModelData.Ash_Limit === 1 ? 'MAX' : 'MIN',
          test_method: gradeModelData.Ash_TestMethod,
        };
        gradeLimitObj.volatile_matter = {
          value: gradeModelData.Volatile_Param,
          limit: gradeModelData.Volatile_Limit === 1 ? 'MAX' : 'MIN',
          test_method: gradeModelData.Volatile_TestMethod,
        };

        gradeLimitObj.po = {
          value: gradeModelData.PO_Param,
          limit: gradeModelData.PO_Limit === 1 ? 'MAX' : 'MIN',
          test_method: gradeModelData.PO_TestMethod,
        };

        gradeLimitObj.pri = {
          value: gradeModelData.PRI_Param,
          limit: gradeModelData.PRI_Limit === 1 ? 'MAX' : 'MIN',
          test_method: gradeModelData.PRI_TestMethod,
        };

        gradeLimitObj.nitrogen = {
          value: gradeModelData.Nitrogen_Param,
          limit: gradeModelData.Nitrogen_Limit === 1 ? 'Max' : 'Min',
          test_method: gradeModelData.Nitrogen_TestMethod,
        };

        gradeLimitObj.mooney = {
          value: gradeModelData.Mooney_Param,
          limit: gradeModelData.Mooney_Limit === 1 ? 'Max' : 'Min',
          test_method: gradeModelData.Mooney_TestMethod,
        };

        pickingDetails.grade_limits = gradeLimitObj;
        pickingDetails.hc_contract_number = si.BrokerContract;

        //Dryer settings
        pallets = pallets.sort((a, b) => a.ProductionDate - b.ProductionDate);
        let productionDateBegin = pallets[0]?.ProductionDate;
        // console.log('pallets[0]___', pallets.length)
        let productionDateEnd = pallets[pallets.length - 1]?.ProductionDate;
        /* console.log(
          productionDateBegin,
          new Date(
            productionDateEnd.setDate(productionDateEnd.getDate() + 1)
          ).toISOString()
        ); */
        let spcDatas = (
          await SPCData.find({
            Datetime: {
              $gt: new Date(productionDateBegin)?.toISOString(),
              $lt: new Date(
                productionDateEnd.setDate(productionDateEnd?.getDate() + 1)
              ).toISOString(),
            },
            Factory: factoryId,
            Deleted: false,
          })
        ).map((d) => {
          return d.toObject();
        });

        const spacDataFunction = (spc) => {
          let spcObject = {};
          const totalSPCData = spc.length;
        
          spcObject['spc_temp1'] =Number(
            (spc.reduce((a, b) => a + b.Temp1, 0) / totalSPCData).toFixed(2)
          );
          spcObject['spc_temp2'] = Number(
            (spc.reduce((a, b) => a + b.Temp2, 0) / totalSPCData).toFixed(2)
          );
          spcObject['spc_temp3'] = Number(
            (spc.reduce((a, b) => a + b.Temp3, 0) / totalSPCData).toFixed(2)
          );
          spcObject['spc_timer'] = Number(
            (spc.reduce((a, b) => a + b.Timer, 0) / totalSPCData).toFixed(2)
          );
          spcObject['spc_biscuit_temp'] = Number(
            (spc.reduce((a, b) => a + b.BiscuitTemp, 0) / totalSPCData).toFixed(
              2
            )
          );
          spcObject['spc_biscuit_weight'] = Number(
            (
              spc.reduce((a, b) => a + b.BiscuitWeight, 0) / totalSPCData
            ).toFixed(2)
          );

          return spcObject;
        };

        pickingDetails.dryer_settings = spacDataFunction(spcDatas);

        //blanket data
        // console.log('factoryId------------------------', factoryId);
        let dryProcessDatas = (
          await DryProcess.find({
            Date: {
              $gt: new Date(productionDateBegin).toISOString(),
              $lt: new Date(
                productionDateEnd.setDate(productionDateEnd.getDate() + 1)
              ).toISOString(),
            },
            Factory: factoryId,
            HSMaster_Detail: { $ne: null },
            Deleted: false,
          }).populate('HSMaster_Detail RMWetProcess')
        ).map((d) => {
          return d.toObject();
        });

        // pickingDetails.DryProcessData = dryProcessDatas;

        let hsMaster_Details = dryProcessDatas.map(
          (x) => x.HSMaster_Detail._id
        );

        let hangingSheds = (
          await HangingShed.find({
            HSMaster_Detail: { $in: hsMaster_Details },
            Factory: factoryId,
            Deleted: false,
          }).populate('HSMaster_Detail')
        ).sort((a, b) => a.Datetime - b.Datetime);

        let blanketDataObject = {
          rlot: [],
          storage_location: [],
          //HS: [], //michelle 210901
          hs: [],
          blanket_date: [],
          wet_date: [],
          intake_date: [],
        };

        const hsData = dryProcessDatas.map((hsDetail) => {
          let hsDetailObj = {};
          hsDetailObj.hs_number_result = hsDetail.HSMaster_Detail.NumberResult;
          return hsDetailObj;
        });
        const hsFilterData = hsData.filter((curr, i, arrs) => {
          return (
            arrs.findIndex(
              (ar) => ar.hs_number_result === curr.hs_number_result
            ) === i
          );
        });
        // console.log(hsFilterData);
        //blanketDataObject.HS = hsFilterData; //michelle 210901
        blanketDataObject.hs = hsFilterData;
        let wetProcesses = (
          await WetProcess.find({
            _id: { $in: hangingSheds.map((x) => x.RMWetProcess) },
            Factory: factoryId,
            Deleted: false,
          })
        ).sort((a, b) => a.Date - b.Date);

        let wetProcessDetails = await StorageLocationDetail_WP.find({
          RMWetProcess: { $in: wetProcesses.map((x) => x._id) },
        });

        let procurements = (
          await Procurement.find({
            StorageLocation: {
              $in: wetProcessDetails.map((x) => x.StorageLocation),
            },
            Deleted: false,
          }).populate('StorageLocation')
        ).sort((a, b) => a.Date - b.Date);

        const StorageLocations = procurements
          .map((x) => {
            let storageLocationObj = {};
            storageLocationObj.storage_number_result =
              x.StorageLocation.NumberResult;
            return storageLocationObj;
          })
          .filter(
            (curr, i, arrs) =>
              arrs.findIndex(
                (ar) => ar.storage_number_result === curr.storage_number_result
              ) === i
          );

        blanketDataObject.storage_location = StorageLocations;

        let rLotAllocations = (
          await RLotAllocation.find({
            StorageLocation_Detail: {
              $elemMatch: {
                $in: StorageLocations.map((x) => x._id),
              },
            },
            Deleted: false,
          }).populate('RLot')
        ).sort((a, b) => a.Date - b.Date);

        blanketDataObject.rlot = rLotAllocations
          .map((x) => {
            let rlotObj = {};
            rlotObj.r_lot_numb = x.RLot;
            return rlotObj;
          })
          .filter((item, i, ar) => ar.indexOf(item.r_lot_numb) === i);
        // }

        // console.log('hangingSheds location', hangingSheds);
        // if (pickingDetails.blanket_data !== undefined) {
        // console.log('====>', hangingSheds[0].Datetime);
        blanketDataObject.blanket_date = [
          {
            begin_dt:
              hangingSheds.length > 0 ? hangingSheds[0].Datetime : undefined,
            end_dt:
              hangingSheds.length > 0
                ? hangingSheds[hangingSheds.length - 1].Datetime
                : undefined,
          },
        ];
        // }
        // console.log('4===>', pickingDetails.date);
        // if (pickingDetails.blanket_data !== undefined) {
        blanketDataObject.wet_date = [
          {
            begin_dt:
              wetProcesses.length > 0 ? wetProcesses[0].Date : undefined,
            end_dt:
              wetProcesses.length > 0
                ? wetProcesses[wetProcesses.length - 1].Date
                : undefined,
          },
        ];
        // }

        blanketDataObject.intake_date = [
          {
            begin_dt:
              procurements.length > 0 ? procurements[0].Date : undefined,
            end_dt:
              procurements.length > 0
                ? procurements[procurements.length - 1].Date
                : undefined,
          },
        ];

        //Michelle 211101 - move blanket data outside info
        //pickingDetails.blanket_data = blanketDataObject;
        blanket_data = blanketDataObject;
        //composition

        let rawMaterialComposition = await Procurement.aggregate([
          {
            $lookup: {
              from: 'Country',
              localField: 'Country',
              foreignField: '_id',
              as: 'Country',
            },
          },
          {
            $unwind: {
              path: '$Country',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'Province',
              localField: 'Province',
              foreignField: '_id',
              as: 'Province',
            },
          },
          {
            $unwind: {
              path: '$Province',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'District',
              localField: 'District',
              foreignField: '_id',
              as: 'District',
            },
          },
          {
            $unwind: {
              path: '$District',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'SourceArea',
              localField: 'SubDistrict',
              foreignField: '_id',
              as: 'SubDistrict',
            },
          },
          {
            $unwind: {
              path: '$SubDistrict',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              Country: 1,
              Province: 1,
              District: 1,
              SubDistrict: 1,
              GrossWeight: 1,
              StorageLocation: 1,
              Deleted: 1,
            },
          },
          {
            $match: {
              StorageLocation: {
                $in: wetProcessDetails.map((x) => x.StorageLocation),
              },
              Deleted: false,
            },
          },
          {
            $group: {
              _id: {
                Province: '$Province',
                District: '$District',
                SubDistrict: '$SubDistrict',
                Country: '$Country',
              },
              GrossWeight: { $sum: { $toDouble: '$GrossWeight' } },
            },
          },
        ]);

        let procurementData = await Procurement.aggregate([
          {
            $match: {
              StorageLocation: {
                $in: wetProcessDetails.map((x) => x.StorageLocation),
              },
              Deleted: false,
            },
          },
        ]);
        const totalGrossWeight = rawMaterialComposition.reduce(
          (a, b) => a + b.GrossWeight,
          0
        );
        function addPrct(area, id) {
          return procurementData
            .filter((proc) => proc[area].toString() === id.toString())
            .reduce((a, b) => a + Number(b.GrossWeight), 0);
        }
        const filterCompositionData = rawMaterialComposition.map((comp) => {
          let compositionObject = {}; 
          compositionObject['area_country'] = comp._id.Country.name.toUpperCase();
          compositionObject['area_province'] = comp._id.Province.Name.toUpperCase();
          compositionObject['area_district'] = comp._id.District.Name.toUpperCase();
          compositionObject['area_sub_district'] = comp._id.SubDistrict.SubDistrict.toUpperCase();
        //Michelle 210903 - change proc_gross_qty to subdistrict % and remove composition_prct by country
         //compositionObject['proc_gross_qty'] = ((comp.GrossWeight / totalGrossWeight) * 100).toFixed(2);
         compositionObject['composition_prct_country'] = Number ((
          (Number(addPrct('Country', comp._id.Country._id)) /
            totalGrossWeight) *
          100
        ).toFixed(2))
        
        compositionObject['composition_prct_province'] = Number((
            (Number(addPrct('Province', comp._id.Province._id)) /
              totalGrossWeight) *
            100
          ).toFixed(2));
          compositionObject['composition_prct_district'] = Number((
            (Number(addPrct('District', comp._id.District._id)) /
              totalGrossWeight) *
            100
          ).toFixed(2));
          //Michelle 210903 - compositionObject['proc_gross_qty'] = ((comp.GrossWeight / totalGrossWeight) * 100).toFixed(2);
          //compositionObject['composition_prct_sub_district'] = Number(((comp.GrossWeight / totalGrossWeight) * 100).toFixed(2));
          compositionObject['composition_prct_sub_district'] = Number(((comp.GrossWeight / totalGrossWeight) * 100).toFixed(2));
          //Michelle 211101 - add this
          compositionObject['proc_gross_qty'] = Number(comp.GrossWeight);
         
          return compositionObject;
        });

        filterCompositionData.sort((a, b) =>
         // a.area_District.localeCompare(b.area_District) //michelle 210901
         a.area_district.localeCompare(b.area_district)
        );

       //michelle 210903 - keep composition outside of Info{}
       // pickingDetails.Composition = filterCompositionData;
       composition = filterCompositionData;

        break;
//For Option SI --END--        
//For Option Lot --START--          
      case 'Lot':
        let lotDatas = await Lot.find({
          $and: [
            { LotNumber: req.params.PickingId },
            { Deleted: false },
            {
              $expr: { $eq: [{ $year: '$LotDate' }, Number(req.params.year)] },
            },
          ],
        })
          .populate({
            path: 'ShippingInstruction',
            populate: 'Buyer Destination',
          })
          .populate('ProductGrade PackingType Factory');

        const lotFilter = lotDatas.filter(
          (lot) => lot.Factory.FctyCode === req.params.factoryCode
        );

        if (lotFilter.length === 0) {
          return res.status(200).send({
            message: 'No data found',
            data: pickingDetails,
            error: null,
          });
        }

        const lot = lotFilter[0];

        // console.log('ID=============>', factoryId);
        // console.log('contract_numb', lot.ShippingInstruction._id);

        factoryId = lot.Factory;
        pickingDetails.factory_cd = lot.Factory.FctyCode.toUpperCase();
        pickingDetails.factory_nm = lot.Factory.FctyName.toUpperCase();
        pickingDetails.contract_numb = lot.ShippingInstruction.Contract;
        pickingDetails.si_numb = lot.ShippingInstruction.SINo;
        // pickingDetails.lot_numb = lot.LotNumber;
        // pickingDetails.pallet_numb = '';
        pickingDetails.si_destination = lot.ShippingInstruction.Destination.Destination.toUpperCase();
        pickingDetails.si_port_of_shipment = lot.ShippingInstruction.PortOfShipment.toUpperCase();
        pickingDetails.contract_buyer_nm = lot.ShippingInstruction.Buyer.name.toUpperCase();
        // pickingDetails.grade_cd = lot.ProductGrade.GradeCode;
        pickingDetails.grade_nm = lot.ProductGrade.GradeName.toUpperCase();
        pickingDetails.lot_numb = lot.LotNumber;
        pickingDetails.packing_typ_nm = lot.PackingType.PckTypeName.toUpperCase();
        pickingDetails.weight = lot.ShippingInstruction.Weight;
        pickingDetails.pallet_shipping_dt = lot.ShippingInstruction.ShipDate;
        //pickingDetails.pallet_stuffing_location = lot.ShippingInstruction.StuffingLocation;

        //michelle 210903 missing  pallet_stuffing_location
        let shipping1 = await Shipping.find({
          ShippingInstruction: mongoose.Types.ObjectId(lot.ShippingInstruction._id),
        });

        pickingDetails.pallet_stuffing_location =
          shipping1.length > 0 ? shipping1[0].StuffingLocation.Name.toUpperCase() : '';


        pallets = await Pallet.find({ Lot: lot._id, Deleted: false });

        pickingDetails.pallets = pallets.map((no) => no.SeqPallet);
        testResults = await TestResult.find(
          {
            Pallet: {
              $in: pallets.map((result) => {
                return result._id;
              }),
            },
          },
          {
            PO: 1,
            Mooney: 1,
            Dirt: 1,
            Ash: 1,
            PRI: 1,
            VM: 1,
            Nitrogen: 1,
          }
        );

        const lot_ProductionDates = pallets
          .map((p) => p.ProductionDate)
          .sort((a, b) => new Date(a) - new Date(b));
        //  const production_latDate =lot_ProductionDates[lot_ProductionDates.length - 1];

        const lot_testDates = pallets
          .map((pallet) => pallet.TestDate)
          .sort((a, b) => new Date(a) - new Date(b));

        pickingDetails.date = [
          {
            description: 'PRODUCTION DATE',
            begin_dt: lot_ProductionDates[0],
            end_dt: lot_ProductionDates[lot_ProductionDates.length - 2], // This need to be monitored If we do length-1 it adds +1 day to date
          },
          {
            description: 'TEST DATE',
            begin_dt: lot_testDates[0],
            end_dt: lot_testDates[lot_testDates.length - 1],
          },
        ];
        //Test result by pallet
        const palletinlot = pallets.map((pal) => pal._id);
        const testResultsDat = await TestResult.find({
          Pallet: { $in: palletinlot },
        }).populate({
          path: 'Pallet',
          model: 'Pallet',
        });

        const resData = pallets.map((no) => {
          let resObj = {};
         //michelle 210903 cange to pallet_numb
         // resObj.pallet_no = no.SeqPallet;
          resObj.pallet_numb = no.SeqPallet;
          const dirtArray = [];
          const ashArray = [];
          const vmArray = [];
          const poArray = [];
          const priArray = [];
          const nitrogenArray = [];
          const mooneyArray = [];

          testResultsDat.forEach((obj) => {
            if (obj.Pallet.SeqPallet === no.SeqPallet) {
              dirtArray.push(obj.Dirt);
              ashArray.push(obj.Ash);
              vmArray.push(obj.VM);
              poArray.push(obj.PO);
              priArray.push(obj.PRI);
              nitrogenArray.push(obj.Nitrogen);
              mooneyArray.push(obj.Mooney);
            }
          });
          resObj.dirt = Number((
            dirtArray.reduce((acc, cur) => acc + cur, 0) / dirtArray.length
          ).toFixed(3));
          resObj.ash = Number((
            ashArray.reduce((acc, cur) => acc + cur, 0) / ashArray.length
          ).toFixed(2));
          resObj.volatile_matter = Number((
            vmArray.reduce((acc, cur) => acc + cur, 0) / vmArray.length
          ).toFixed(2));
          resObj.po = Number((
            poArray.reduce((acc, cur) => acc + cur, 0) / poArray.length
          ).toFixed(1));
          // resObj.po_min = Math.min(...poArray);
          // resObj.po_max = Math.max(...poArray);
          resObj.pri = Number((
            priArray.reduce((acc, cur) => acc + cur, 0) / priArray.length
          ).toFixed(1));
          resObj.nitrogen = Number((
            nitrogenArray.reduce((acc, cur) => acc + cur, 0) /
            nitrogenArray.length
          ).toFixed(2));
          resObj.mooney = Number((
            mooneyArray.reduce((acc, cur) => acc + cur, 0) / mooneyArray.length
          ).toFixed(1));
          return resObj;
        });
        pickingDetails.test_results_by_pallet = resData;

        /*  console.log('palletmap---------->', palletinlot);
        console.log('testResultsDat---------->', testResultsDat.slice(0, 3));
        console.log('length', testResultsDat.length); */

        const testresult_PO_array_lot = testResults.map(
          (tsPos) => typeof tsPos.PO === 'number' && tsPos.PO
        );
        const testresult_PRI_array_lot = testResults.map(
          (tsPos) => typeof tsPos.PRI === 'number' && tsPos.PRI
        );
        const testresult_Dirt_array_lot = testResults.map(
          (tsPos) => typeof tsPos.Dirt === 'number' && tsPos.Dirt
        );
        const testresult_Ash_array_lot = testResults.map(
          (tsPos) => typeof tsPos.Ash === 'number' && tsPos.Ash
        );
        const testresult_Mooney_array_lot = testResults.map(
          (tsPos) => typeof tsPos.Mooney === 'number' && tsPos.Mooney
        );
        const testResults_VM_array_lot = testResults.map(
          (tsPos) => typeof tsPos.VM === 'number' && tsPos.VM
        );

        const testResults_nitrogen_array_lot = testResults.map(
          (tsPos) => typeof tsPos.Nitrogen === 'number' && tsPos.Nitrogen
        );

        /* pickingDetails.TestResults = [
          testResultAverage(
            testresult_PO_array_lot,
            testresult_PRI_array_lot,
            testresult_Dirt_array_lot,
            testresult_Ash_array_lot,
            testresult_Mooney_array_lot,
            testResults_VM_array_lot,
            testResults_nitrogen_array_lot
          ),
          testResultMax(
            testresult_PO_array_lot,
            testresult_PRI_array_lot,
            testresult_Dirt_array_lot,
            testresult_Ash_array_lot,
            testresult_Mooney_array_lot,
            testResults_VM_array_lot,
            testResults_nitrogen_array_lot
          ),
          testResultMin(
            testresult_PO_array_lot,
            testresult_PRI_array_lot,
            testresult_Dirt_array_lot,
            testresult_Ash_array_lot,
            testresult_Mooney_array_lot,
            testResults_VM_array_lot,
            testResults_nitrogen_array_lot
          ),
        ]; */
        const lotGradeModelData = await CountryGrade.findOne({
          _id: lot.ProductGrade.GradeCountryGrd,
        }).populate('Country');
        let lotGradeLimitObj = {};
        lotGradeLimitObj.grade_name = lotGradeModelData.CountryGrade.toUpperCase();
        lotGradeLimitObj.grade_commodity = lotGradeModelData.Commodity.toUpperCase();
        lotGradeLimitObj.producing_country = lotGradeModelData.Country.name.toUpperCase();

        lotGradeLimitObj.dirt = {
          value: lotGradeModelData.Dirt_Param,
          limit: lotGradeModelData.Dirt_Limit === 1 ? 'MAX' : 'MIN',
          test_method: lotGradeModelData.Dirt_TestMethod,
        };
        lotGradeLimitObj.ash = {
          value: lotGradeModelData.Ash_Param,
          limit: lotGradeModelData.Ash_Limit === 1 ? 'MAX' : 'MIN',
          test_method: lotGradeModelData.Ash_TestMethod,
        };
        lotGradeLimitObj.volatile_matter = {
          value: lotGradeModelData.Volatile_Param,
          limit: lotGradeModelData.Volatile_Limit === 1 ? 'MAX' : 'MIN',
          test_method: lotGradeModelData.Volatile_TestMethod,
        };

        lotGradeLimitObj.po = {
          value: lotGradeModelData.PO_Param,
          limit: lotGradeModelData.PO_Limit === 1 ? 'MAX' : 'MIN',
          test_method: lotGradeModelData.PO_TestMethod,
        };

        lotGradeLimitObj.pri = {
          value: lotGradeModelData.PRI_Param,
          limit: lotGradeModelData.PRI_Limit === 1 ? 'MAX' : 'MIN',
          test_method: lotGradeModelData.PRI_TestMethod,
        };

        lotGradeLimitObj.nitrogen = {
          value: lotGradeModelData.Nitrogen_Param,
          limit: lotGradeModelData.Nitrogen_Limit === 1 ? 'MAX' : 'MIN',
          test_method: lotGradeModelData.Nitrogen_TestMethod,
        };

        lotGradeLimitObj.mooney = {
          value: lotGradeModelData.Mooney_Param,
          limit: lotGradeModelData.Mooney_Limit === 1 ? 'MAX' : 'MIN',
          test_method: lotGradeModelData.Mooney_TestMethod,
        };

        pickingDetails.grade_limits = lotGradeLimitObj;

        //composition

        pallets = pallets.sort((a, b) => a.ProductionDate - b.ProductionDate);

        let productionDateBegins = pallets[0].ProductionDate;
        const getDate = new Date(productionDateBegins).getDate();
        const greaterDate = new Date(productionDateBegins).setDate(getDate + 1);
        const dateToSearch = new Date(greaterDate).toISOString();

        let dryProcessDataLot = (
          await DryProcess.find({
            Date: {
              $gt: new Date(productionDateBegins).toISOString(),
              $lt: dateToSearch,
            },
            Factory: factoryId._id,
            HSMaster_Detail: { $ne: null },
            Deleted: false,
          }).populate('HSMaster_Detail RMWetProcess')
        ).map((d) => {
          return d.toObject();
        });

        // console.log(
        //   'dryProcessDataLot ===============================> ',
        //   dryProcessDataLot,
        //   factoryId._id,
        //   productionDateBegins,
        //   dateToSearch
        // );

        let hsMaster_DetailsLot = dryProcessDataLot.map(
          (x) => x.HSMaster_Detail._id
        );

        let hangingShedsLot = (
          await HangingShed.find({
            HSMaster_Detail: { $in: hsMaster_DetailsLot },
            Factory: factoryId,
            Deleted: false,
          }).populate('HSMaster_Detail')
        ).sort((a, b) => a.Datetime - b.Datetime);

        let wetProcessesLot = (
          await WetProcess.find({
            _id: { $in: hangingShedsLot.map((x) => x.RMWetProcess) },
            Factory: factoryId,
            Deleted: false,
          })
        ).sort((a, b) => a.Date - b.Date);

        let wetProcessDetailsLot = await StorageLocationDetail_WP.find({
          RMWetProcess: { $in: wetProcessesLot.map((x) => x._id) },
        });

        let rawMaterialCompositionLot = await Procurement.aggregate([
          {
            $lookup: {
              from: 'Country',
              localField: 'Country',
              foreignField: '_id',
              as: 'Country',
            },
          },
          {
            $unwind: {
              path: '$Country',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'Province',
              localField: 'Province',
              foreignField: '_id',
              as: 'Province',
            },
          },
          {
            $unwind: {
              path: '$Province',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'District',
              localField: 'District',
              foreignField: '_id',
              as: 'District',
            },
          },
          {
            $unwind: {
              path: '$District',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'SourceArea',
              localField: 'SubDistrict',
              foreignField: '_id',
              as: 'SubDistrict',
            },
          },
          {
            $unwind: {
              path: '$SubDistrict',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              Country: 1,
              Province: 1,
              District: 1,
              SubDistrict: 1,
              GrossWeight: 1,
              StorageLocation: 1,
              Deleted: 1,
            },
          },
          {
            $match: {
              StorageLocation: {
                $in: wetProcessDetailsLot.map((x) => x.StorageLocation),
              },
              Deleted: false,
            },
          },
          {
            $group: {
              _id: {
                Province: '$Province',
                District: '$District',
                SubDistrict: '$SubDistrict',
                Country: '$Country',
              },
              GrossWeight: { $sum: { $toDouble: '$GrossWeight' } },
            },
          },
        ]);

        let procurementDataLot = await Procurement.aggregate([
          {
            $match: {
              StorageLocation: {
                $in: wetProcessDetailsLot.map((x) => x.StorageLocation),
              },
              Deleted: false,
            },
          },
        ]);
        const totalGrossWeightlot = rawMaterialCompositionLot.reduce(
          (a, b) => a + b.GrossWeight,
          0
        );

        function addPrctLot(area, id) {
          return procurementDataLot
            .filter((proc) => proc[area].toString() === id.toString())
            .reduce((a, b) => a + Number(b.GrossWeight), 0);
        }
        const filterCompositionDataLot = rawMaterialCompositionLot.map(
          (comp) => {
            let compositionObject = {};
            compositionObject['area_country'] = comp._id.Country.name.toUpperCase();
            compositionObject['area_province'] = comp._id.Province.Name.toUpperCase();
            compositionObject['area_district'] = comp._id.District.Name.toUpperCase();
            compositionObject['area_sub_district'] = comp._id.SubDistrict.SubDistrict.toUpperCase();
            //Michelle 210903 - change to Subdistrict and compostion_prct to prct_country
            //compositionObject['proc_gross_qty'] = ((comp.GrossWeight / totalGrossWeightlot) * 100 ).toFixed(2);
            compositionObject['composition_prct_country'] = Number((
              (Number(addPrctLot('Country', comp._id.Country._id)) /
                totalGrossWeightlot) *
              100
            ).toFixed(2));
            compositionObject['composition_prct_province'] = Number((
              (Number(addPrctLot('Province', comp._id.Province._id)) /
                totalGrossWeightlot) *
              100
            ).toFixed(2));
            compositionObject['composition_prct_district'] = Number((
              (Number(addPrctLot('District', comp._id.District._id)) /
                totalGrossWeightlot) *
              100
            ).toFixed(2));
            compositionObject['composition_prct_sub_district'] = Number(((comp.GrossWeight / totalGrossWeightlot) * 100 ).toFixed(2));
            //Michelle 211101 - add this
            compositionObject['proc_gross_qty'] = Number(comp.GrossWeight); //.toFixed(2);

            return compositionObject;
          }
        );

        filterCompositionDataLot.sort((a, b) =>
          //a.area_District.localeCompare(b.area_District)
          a.area_district.localeCompare(b.area_district)
        );

        //michelle 210903 - keep composition outside of Info{}
        //pickingDetails.Composition = filterCompositionDataLot;
        composition = filterCompositionDataLot;
        break;
//For Option Lot --END-- 
//For Option Pallet --START-- 
      case 'Pallet':
        // console.log('----------------------PALLET');
        let palletDatas = await Pallet.find({
          $and: [
            { SeqPallet: req.params.PickingId },
            { Deleted: false },
            {
              $expr: {
                $eq: [{ $year: '$ProductionDate' }, Number(req.params.year)],
              },
            },
          ],
        })
          .populate('ProductGrade PackingType Factory')
          /* .populate({
            path: 'ShippingInstruction',
            populate: 'Buyer Destination',
          }) */
          .populate({
            path: 'Lot',
            populate: {
              path: 'ShippingInstruction',
              populate: 'Buyer Destination',
            },
          });

        const palletFilter = palletDatas.filter(
          (pallet) => pallet.Factory.FctyCode === req.params.factoryCode
        );

        if (palletFilter.length === 0) {
          return res.status(200).send({
            message: 'No data found',
            data: pickingDetails,
            error: null,
          });
        }

        const pallet = palletFilter[0];

        // console.log(pallet);
        factoryId = pallet.Factory;
        pickingDetails.factory_cd = pallet.Factory.FctyCode.toUpperCase();
        pickingDetails.factory_nm = pallet.Factory.FctyName.toUpperCase();
        pickingDetails.contract_numb = pallet.Lot.ShippingInstruction.Contract;
        pickingDetails.si_numb = pallet.Lot.ShippingInstruction.SINo;
        pickingDetails.si_destination =
          pallet.Lot.ShippingInstruction.Destination.Destination.toUpperCase();
        pickingDetails.si_port_of_shipment =
          pallet.Lot.ShippingInstruction.PortOfShipment.toUpperCase();
        pickingDetails.contract_buyer_nm =
          pallet.Lot.ShippingInstruction.Buyer.name.toUpperCase();
        // pickingDetails.grade_cd = pallet.ProductGrade.GradeCode;
        pickingDetails.grade_nm = pallet.ProductGrade.GradeName.toUpperCase();
        pickingDetails.lot_numb = pallet.Lot.LotNumber;
        pickingDetails.pallet_numb = pallet.SeqPallet;
        pickingDetails.packing_typ_nm = pallet.PackingType.PckTypeName.toUpperCase();
        pickingDetails.weight = pallet.Lot.ShippingInstruction.Weight;
        pickingDetails.pallet_rmrk = pallet.Remarks.toUpperCase();
        pickingDetails.pallet_sts_progress_nm = pallet.PalletStatus.toUpperCase();
        pickingDetails.pallet_sample_count = pallet.DefaultTestResult;
        pickingDetails.pallet_shipping_dt =
          pallet.Lot.ShippingInstruction.ShipDate;
       // pickingDetails.pallet_stuffing_location =  pallet.Lot.ShippingInstruction.StuffingLocation;

        pallets = [pallet.toObject()];

      //michelle 210903 missing  pallet_stuffing_location
       /*  if (
          (pickingDetails.ShippingInstruction === null ||
            pickingDetails.ShippingInstruction === undefined) &&
          pickingDetails.Lot !== null &&
          pickingDetails.Lot !== undefined
        ) {
          pickingDetails.ShippingInstruction =
            pickingDetails.Lot.ShippingInstruction;
        } */

        let shipping2 = await Shipping.find({
          ShippingInstruction: mongoose.Types.ObjectId(pallet.Lot.ShippingInstruction._id),
        });

        pickingDetails.pallet_stuffing_location =
          shipping2.length > 0 ? shipping2[0].StuffingLocation.Name.toUpperCase() : '';


        const pallet_productionDates = pallets
          .map((p) => p.ProductionDate)
          .sort((a, b) => new Date(a) - new Date(b));
        const pallet_testDates = pallets
          .map((p) => p.TestDate)
          .sort((a, b) => new Date(a) - new Date(b));

        pickingDetails.date = [
          {
            description: 'PRODUCTION DATE',
            begin_dt: pallet_productionDates[0],
            end_dt: pallet_productionDates[pallet_productionDates.length - 1],
          },
          {
            description: 'TEST DATE',
            begin_dt: pallet_testDates[0],
            end_dt: pallet_testDates[pallet_testDates.length - 1],
          },
        ];

        testResults = await TestResult.find(
          { Pallet: pallet._id },
          {
            PO: 1,
            Mooney: 1,
            Dirt: 1,
            Ash: 1,
            PRI: 1,
            VM: 1,
            Nitrogen: 1,
          }
        );
        const testresult_PO_array_pallet = testResults.map(
          (tsPos) => typeof tsPos.PO === 'number' && tsPos.PO
        );
        const testresult_PRI_array_pallet = testResults.map(
          (tsPos) => typeof tsPos.PRI === 'number' && tsPos.PRI
        );
        const testresult_Dirt_array_pallet = testResults.map(
          (tsPos) => typeof tsPos.Dirt === 'number' && tsPos.Dirt
        );
        const testresult_Ash_array_pallet = testResults.map(
          (tsPos) => typeof tsPos.Ash === 'number' && tsPos.Ash
        );
        const testresult_Mooney_array_pallet = testResults.map(
          (tsPos) => typeof tsPos.Mooney === 'number' && tsPos.Mooney
        );
        const testResults_VM_array_pallet = testResults.map(
          (tsPos) => typeof tsPos.VM === 'number' && tsPos.VM
        );
        const testResults_nitrogen_array_pallet = testResults.map(
          (tsPos) => typeof tsPos.Nitrogen === 'number' && tsPos.Nitrogen
        );
        /* pickingDetails.TestResults = [
          testResultAverage(
            testresult_PO_array_pallet,
            testresult_PRI_array_pallet,
            testresult_Dirt_array_pallet,
            testresult_Ash_array_pallet,
            testresult_Mooney_array_pallet,
            testResults_VM_array_pallet,
            testResults_nitrogen_array_pallet
          ),
          testResultMax(
            testresult_PO_array_pallet,
            testresult_PRI_array_pallet,
            testresult_Dirt_array_pallet,
            testresult_Ash_array_pallet,
            testresult_Mooney_array_pallet,
            testResults_VM_array_pallet,
            testResults_nitrogen_array_pallet
          ),
          testResultMin(
            testresult_PO_array_pallet,
            testresult_PRI_array_pallet,
            testresult_Dirt_array_pallet,
            testresult_Ash_array_pallet,
            testresult_Mooney_array_pallet,
            testResults_VM_array_pallet,
            testResults_nitrogen_array_pallet
          ),
        ]; */

        pickingDetails.test_results = [];

        //Test results by pallet
        const palletId = pallet._id;
        const testResults_data = await TestResult.find({
          Pallet: { $in: palletId },
        }).populate({
          path: 'Pallet',
          model: 'Pallet',
        });

        let responseObject = {};
        const dirtArray = [];
        const ashArray = [];
        const vmArray = [];
        const poArray = [];
        const priArray = [];
        const nitrogenArray = [];
        const mooneyArray = [];

        testResults_data.forEach((obj) => {
          if (obj.Pallet.SeqPallet === pallet.SeqPallet) {
            dirtArray.push(obj.Dirt);
            ashArray.push(obj.Ash);
            vmArray.push(obj.VM);
            poArray.push(obj.PO);
            priArray.push(obj.PRI);
            nitrogenArray.push(obj.Nitrogen);
            mooneyArray.push(obj.Mooney);
          }
        });
        responseObject.dirt = Number((
          dirtArray.reduce((acc, cur) => acc + cur, 0) / dirtArray.length
        ).toFixed(3));
        responseObject.ash = Number((
          ashArray.reduce((acc, cur) => acc + cur, 0) / ashArray.length
        ).toFixed(2));
        responseObject.volatile_matter = Number((
          vmArray.reduce((acc, cur) => acc + cur, 0) / vmArray.length
        ).toFixed(2));
        responseObject.po = Number((
          poArray.reduce((acc, cur) => acc + cur, 0) / poArray.length
        ).toFixed(1));
        // resObj.po_min = Math.min(...poArray);
        // resObj.po_max = Math.max(...poArray);
        responseObject.pri = Number((
          priArray.reduce((acc, cur) => acc + cur, 0) / priArray.length
        ).toFixed(1));
        responseObject.nitrogen = Number((
          nitrogenArray.reduce((acc, cur) => acc + cur, 0) /
          nitrogenArray.length
        ).toFixed(2));
        responseObject.mooney = Number((
          mooneyArray.reduce((acc, cur) => acc + cur, 0) / mooneyArray.length
        ).toFixed(1));

        pickingDetails.test_results = responseObject;

        const palletGradeModelData = await CountryGrade.findOne({
          _id: pallet.ProductGrade.GradeCountryGrd,
        }).populate('Country');
        let palletGradeLimitObj = {};
        palletGradeLimitObj.grade_name = palletGradeModelData.CountryGrade.toUpperCase();
        palletGradeLimitObj.grade_commodity = palletGradeModelData.Commodity.toUpperCase();
        palletGradeLimitObj.producing_country = palletGradeModelData.Country.name.toUpperCase();

        palletGradeLimitObj.dirt = {
          value: palletGradeModelData.Dirt_Param,
          limit: palletGradeModelData.Dirt_Limit === 1 ? 'MAX' : 'MIN',
          test_method: palletGradeModelData.Dirt_TestMethod,
        };
        palletGradeLimitObj.ash = {
          value: palletGradeModelData.Ash_Param,
          limit: palletGradeModelData.Ash_Limit === 1 ? 'MAX' : 'MIN',
          test_method: palletGradeModelData.Ash_TestMethod,
        };
        palletGradeLimitObj.volatile_matter = {
          value: palletGradeModelData.Volatile_Param,
          limit: palletGradeModelData.Volatile_Limit === 1 ? 'MAX' : 'MIN',
          test_method: palletGradeModelData.Volatile_TestMethod,
        };

        palletGradeLimitObj.po = {
          value: palletGradeModelData.PO_Param,
          limit: palletGradeModelData.PO_Limit === 1 ? 'MAX' : 'MIN',
          test_method: palletGradeModelData.PO_TestMethod,
        };

        palletGradeLimitObj.pri = {
          value: palletGradeModelData.PRI_Param,
          limit: palletGradeModelData.PRI_Limit === 1 ? 'MAX' : 'MIN',
          test_method: palletGradeModelData.PRI_TestMethod,
        };

        palletGradeLimitObj.nitrogen = {
          value: palletGradeModelData.Nitrogen_Param,
          limit: palletGradeModelData.Nitrogen_Limit === 1 ? 'MAX' : 'MIN',
          test_method: palletGradeModelData.Nitrogen_TestMethod,
        };

        palletGradeLimitObj.mooney = {
          value: palletGradeModelData.Mooney_Param,
          limit: palletGradeModelData.Mooney_Limit === 1 ? 'MAX' : 'MIN',
          test_method: palletGradeModelData.Mooney_TestMethod,
        };

        pickingDetails.grade_limits = palletGradeLimitObj;

        //composition

        // pallets = pallets.sort((a, b) => a.ProductionDate - b.ProductionDate);

        let productionDateBeginsPallet = pallet_productionDates[0];
        const getDatepallet = new Date(productionDateBeginsPallet).getDate();
        const greaterDatepallet = new Date(productionDateBeginsPallet).setDate(
          getDatepallet + 1
        );
        const dateToSearchpallet = new Date(greaterDatepallet).toISOString();

        let dryProcessDataPallet = (
          await DryProcess.find({
            Date: {
              $gt: new Date(productionDateBeginsPallet).toISOString(),
              $lt: dateToSearchpallet,
            },
            Factory: factoryId._id,
            HSMaster_Detail: { $ne: null },
            Deleted: false,
          }).populate('HSMaster_Detail RMWetProcess')
        ).map((d) => {
          return d.toObject();
        });

        // console.log(
        //   'dryProcessDatapallet ===============================> ',
        //   dryProcessDataPallet,
        //   factoryId._id,
        //   productionDateBeginsPallet,
        //   dateToSearchpallet
        // );

        let hsMaster_DetailsPallet = dryProcessDataPallet.map(
          (x) => x.HSMaster_Detail._id
        );

        let hangingShedsPallet = (
          await HangingShed.find({
            HSMaster_Detail: { $in: hsMaster_DetailsPallet },
            Factory: factoryId,
            Deleted: false,
          }).populate('HSMaster_Detail')
        ).sort((a, b) => a.Datetime - b.Datetime);

        let wetProcessesPallet = (
          await WetProcess.find({
            _id: { $in: hangingShedsPallet.map((x) => x.RMWetProcess) },
            Factory: factoryId,
            Deleted: false,
          })
        ).sort((a, b) => a.Date - b.Date);

        let wetProcessDetailsPallet = await StorageLocationDetail_WP.find({
          RMWetProcess: { $in: wetProcessesPallet.map((x) => x._id) },
        });

        let rawMaterialCompositionPallet = await Procurement.aggregate([
          {
            $lookup: {
              from: 'Country',
              localField: 'Country',
              foreignField: '_id',
              as: 'Country',
            },
          },
          {
            $unwind: {
              path: '$Country',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'Province',
              localField: 'Province',
              foreignField: '_id',
              as: 'Province',
            },
          },
          {
            $unwind: {
              path: '$Province',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'District',
              localField: 'District',
              foreignField: '_id',
              as: 'District',
            },
          },
          {
            $unwind: {
              path: '$District',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'SourceArea',
              localField: 'SubDistrict',
              foreignField: '_id',
              as: 'SubDistrict',
            },
          },
          {
            $unwind: {
              path: '$SubDistrict',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              Country: 1,
              Province: 1,
              District: 1,
              SubDistrict: 1,
              GrossWeight: 1,
              StorageLocation: 1,
              Deleted: 1,
            },
          },
          {
            $match: {
              StorageLocation: {
                $in: wetProcessDetailsPallet.map((x) => x.StorageLocation),
              },
              Deleted: false,
            },
          },
          {
            $group: {
              _id: {
                Province: '$Province',
                District: '$District',
                SubDistrict: '$SubDistrict',
                Country: '$Country',
              },
              GrossWeight: { $sum: { $toDouble: '$GrossWeight' } },
            },
          },
        ]);

        let procurementDataPalletData = await Procurement.aggregate([
          {
            $match: {
              StorageLocation: {
                $in: wetProcessDetailsPallet.map((x) => x.StorageLocation),
              },
              Deleted: false,
            },
          },
        ]);

        const totalGrossWeightPallet = rawMaterialCompositionPallet.reduce(
          (a, b) => a + b.GrossWeight,
          0
        );

        function addPrcts(area, id) {
          return procurementDataPalletData
            .filter((proc) => proc[area].toString() === id.toString())
            .reduce((a, b) => a + Number(b.GrossWeight), 0);
        }
        const filterCompositionDataPallet = rawMaterialCompositionPallet.map(
          (comp) => {
            let compositionObject = {};
            compositionObject['area_country'] = comp._id.Country.name.toUpperCase();
            compositionObject['area_province'] = comp._id.Province.Name.toUpperCase();
            compositionObject['area_district'] = comp._id.District.Name.toUpperCase();
            compositionObject['area_sub_district'] = comp._id.SubDistrict.SubDistrict.toUpperCase();
            //Michelle 210903 change to subdisctrict and prct_country
            //compositionObject['proc_gross_qty'] = ((comp.GrossWeight / totalGrossWeightPallet) * 100 ).toFixed(2);
            compositionObject['composition_prct_country'] = Number((
              (Number(addPrcts('Country', comp._id.Country._id)) /
                totalGrossWeightPallet) *
              100
            ).toFixed(2));
            compositionObject['composition_prct_province'] = Number((
              (Number(addPrcts('Province', comp._id.Province._id)) /
                totalGrossWeightPallet) *
              100
            ).toFixed(2));
            compositionObject['composition_prct_district'] = Number((
              (Number(addPrcts('District', comp._id.District._id)) /
                totalGrossWeightPallet) *
              100
            ).toFixed(2));

            compositionObject['composition_prct_sub_district'] = Number(((comp.GrossWeight / totalGrossWeightPallet) * 100 ).toFixed(2));
            //Michelle 211101 - add this
            compositionObject['proc_gross_qty'] = Number(comp.GrossWeight)//.toFixed(2);
            return compositionObject;
          }
        );

        filterCompositionDataPallet.sort((a, b) =>
          //a.area_District.localeCompare(b.area_District)
          a.area_district.localeCompare(b.area_district)
        );

        //michelle 210903 - keep composition outside of Info{}
        //pickingDetails.Composition = filterCompositionDataPallet;
        composition = filterCompositionDataPallet;
        break;
    }

    //test result function

    function testResultAverage(
      testresult_PO_array,
      testresult_PRI_array,
      testresult_Dirt_array,
      testresult_Ash_array,
      testresult_Mooney_array,
      testresult_VM_array,
      testresult_Nitrogen_array
    ) {
      const testresult_PO_array_filter = testresult_PO_array.filter(
        (a) => a !== 0
      );
      const testresult_PRI_array_filter = testresult_PRI_array.filter(
        (a) => a !== 0
      );
      const testresult_Dirt_array_filter = testresult_Dirt_array.filter(
        (a) => a !== 0
      );
      const testresult_Ash_array_filter = testresult_Ash_array.filter(
        (a) => a !== 0
      );
      const testresult_Mooney_array_filter = testresult_Mooney_array.filter(
        (a) => a !== 0
      );
      const testresult_VM_array_filter = testresult_VM_array.filter(
        (a) => a !== 0
      );
      const testresult_Nitrogen_array_filter = testresult_Nitrogen_array.filter(
        (a) => a !== 0
      );

      return {
        description: 'AVG',
       // testresult_Po: //michelle 210901 
        po: 
          testresult_PO_array_filter.length === 0
            ? 0
            : Number((
                testresult_PO_array_filter.reduce((acc, cur) => acc + cur, 0) /
                testresult_PO_array_filter.length
              ).toFixed(1)),
        // testresult_PRI: //michelle 210901 
        pri: 
          testresult_PRI_array_filter.length === 0
            ? 0
            : Number((
                testresult_PRI_array_filter.reduce((acc, cur) => acc + cur, 0) /
                testresult_PRI_array_filter.length
              ).toFixed(1)),
       // testresult_Dirt: //michelle 210901 
        dirt:
          testresult_Dirt_array_filter.length === 0
            ? 0
            : Number((
                testresult_Dirt_array_filter.reduce(
                  (acc, cur) => acc + cur,
                  0
                ) / testresult_Dirt_array_filter.length
              ).toFixed(3)),
       // testresult_Ash://michelle 210901 
        ash:
          testresult_Ash_array_filter.length === 0
            ? 0
            : Number((
                testresult_Ash_array_filter.reduce((acc, cur) => acc + cur, 0) /
                testresult_Ash_array_filter.length
              ).toFixed(2)),
        //testresult_Mooney: //michelle 210901
        mooney:
          testresult_Mooney_array_filter.length === 0
            ? 0
            : Number((
                testresult_Mooney_array_filter.reduce(
                  (acc, cur) => acc + cur,
                  0
                ) / testresult_Mooney_array_filter.length
              )
                .toFixed(1)),
               // .toString(),
        // testresult_VM: //michelle 210901
        volatile_matter:
          testresult_VM_array_filter.length === 0
            ? 0
            : Number((
                testresult_VM_array_filter.reduce((acc, cur) => acc + cur) /
                testresult_VM_array_filter.length
              )
                .toFixed(2)),
               // .toString(),
        //testresult_Nitrogen: //michelle 210901
        nitrogen:
          testresult_Nitrogen_array_filter.length === 0
            ? 0
            : Number((
                testresult_Nitrogen_array_filter.reduce(
                  (acc, cur) => acc + cur,
                  0
                ) / testresult_Nitrogen_array_filter.length
              ).toFixed(2)),
      };
    }

    function testResultMax(
      testresult_PO_array,
      testresult_PRI_array,
      testresult_Dirt_array,
      testresult_Ash_array,
      testresult_Mooney_array,
      testresult_VM_array,
      testresult_Nitrogen_array
    ) {
      return {
        //michelle 210901
        /* description: 'Max',
        testresult_PO: Math.max(...testresult_PO_array).toFixed(1),
        testresult_PRI: Math.max(...testresult_PRI_array).toFixed(1),
        testresult_Dirt: Math.max(...testresult_Dirt_array).toFixed(3),
        testresult_Ash: Math.max(...testresult_Ash_array).toFixed(2),
        testresult_Mooney: Math.max(...testresult_Mooney_array).toFixed(1),
        testresult_VM: Math.max(...testresult_VM_array).toFixed(2),
        testresult_Nitrogen: Math.max(...testresult_Nitrogen_array).toFixed(2), */
        
        description: 'MAX',
        po: Number(Math.max(...testresult_PO_array).toFixed(1)),
        pri: Number(Math.max(...testresult_PRI_array).toFixed(1)),
        dirt: Number(Math.max(...testresult_Dirt_array).toFixed(3)),
        ash: Number(Math.max(...testresult_Ash_array).toFixed(2)),
        mooney: Number(Math.max(...testresult_Mooney_array).toFixed(1)),
        volatile_matter: Number(Math.max(...testresult_VM_array).toFixed(2)),
        nitrogen: Number(Math.max(...testresult_Nitrogen_array).toFixed(2)),
      };
    }

    function testResultMin(
      testresult_PO_array,
      testresult_PRI_array,
      testresult_Dirt_array,
      testresult_Ash_array,
      testresult_Mooney_array,
      testresult_VM_array,
      testresult_Nitrogen_array
    ) {
      return {
       //michelle 210901
        /* description: 'Min',
        testresult_PO: Math.min(...testresult_PO_array).toFixed(1),
        testresult_PRI: Math.min(...testresult_PRI_array).toFixed(1),
        testresult_Dirt: Math.min(...testresult_Dirt_array).toFixed(3),
        testresult_Ash: Math.min(...testresult_Ash_array).toFixed(2),
        testresult_Mooney: Math.min(...testresult_Mooney_array).toFixed(1),
        testresult_VM: Math.min(...testresult_VM_array).toFixed(2),
        testresult_Nitrogen: Math.min(...testresult_Nitrogen_array).toFixed(2), */

        description: 'MIN',
        po: Number(Math.min(...testresult_PO_array).toFixed(1)),
        pri: Number(Math.min(...testresult_PRI_array).toFixed(1)),
        dirt: Number(Math.min(...testresult_Dirt_array).toFixed(3)),
        ash: Number(Math.min(...testresult_Ash_array).toFixed(2)),
        mooney: Number(Math.min(...testresult_Mooney_array).toFixed(1)),
        volatile_matter: Number(Math.min(...testresult_VM_array).toFixed(2)),
        nitrogen: Number(Math.min(...testresult_Nitrogen_array).toFixed(2)),
      };
    }

    if (pallets.length > 0) {
      pallets = pallets.sort((a, b) => a.ProductionDate - b.ProductionDate);

      let productionDateBegin = pallets[0].ProductionDate;
      let productionDateEnd = pallets[pallets.length - 1].ProductionDate;

      let dryProcessDatas = (
        await DryProcess.find({
          Date: {
            $gte: productionDateBegin,
            $lte: productionDateEnd,
          },
          Factory: factoryId,
          HSMaster_Detail: { $ne: null },
          Deleted: false,
        }).populate('HSMaster_Detail RMWetProcess')
      ).map((d) => {
        return d.toObject();
      });

      // pickingDetails.DryProcessData = dryProcessDatas;

      let hsMaster_Details = dryProcessDatas.map((x) => x.HSMaster_Detail._id);

      let hangingSheds = (
        await HangingShed.find({
          HSMaster_Detail: { $in: hsMaster_Details },
          Factory: factoryId,
          Deleted: false,
        }).populate('HSMaster_Detail')
      ).sort((a, b) => a.Datetime - b.Datetime);
      // const storageLocationModelData = await storageLocationModel.find({
      //   Factory: factoryId,
      // });
      // const storageLocationIds = storageLocationModelData.map((str) =>
      //   mongoose.Types.ObjectId(str._id)
      // );
      // const stroRageLocationDetails = await storageLocationDetailsModel.find({
      //   StorageLocation: storageLocationIds,
      // });

      let blanketDataObject = {
        rlot: [],
        storage_location: [],
        HS: [], 
        blanket_date: [],
        wet_date: [],
        intake_date: [],
      };

      // blanketDataObject.storage_location = stroRageLocationDetails.map(
      //   (strDetail) => {
      //     let storageLocationObj = {};
      //     storageLocationObj.storage_number_result = strDetail.NumberResult;
      //     return storageLocationObj;
      //   }
      // );
      blanketDataObject.HS = dryProcessDatas
        .map((hsDetail) => {
          let hsDetailObj = {};
          hsDetailObj.hs_number_result = hsDetail.HSMaster_Detail.NumberResult;
          return hsDetailObj;
        })
        .filter(
          (curr, i, arrs) =>
            arrs.findIndex(
              (ar) => ar.hs_number_result === curr.hs_number_result
            ) === i
        );

      // pickingDetails.blanket_data = {
      //   storage_location: ,
      //   HS: ,
      // };

      let wetProcesses = (
        await WetProcess.find({
          _id: { $in: hangingSheds.map((x) => x.RMWetProcess) },
          Factory: factoryId,
          Deleted: false,
        })
      ).sort((a, b) => a.Date - b.Date);

      let wetProcessDetails = await StorageLocationDetail_WP.find({
        RMWetProcess: { $in: wetProcesses.map((x) => x._id) },
      });

      let procurements = (
        await Procurement.find({
          StorageLocation: {
            $in: wetProcessDetails.map((x) => x.StorageLocation),
          },
          Deleted: false,
        }).populate('StorageLocation')
      ).sort((a, b) => a.Date - b.Date);

      const StorageLocations = procurements
        .map((x) => {
          let storageLocationObj = {};
          storageLocationObj.storage_number_result =
            x.StorageLocation.NumberResult;
          return storageLocationObj;
        })
        .filter(
          (curr, i, arrs) =>
            arrs.findIndex(
              (ar) => ar.storage_number_result === curr.storage_number_result
            ) === i
        );

      blanketDataObject.storage_location = StorageLocations;

      let rLotAllocations = (
        await RLotAllocation.find({
          StorageLocation_Detail: {
            $elemMatch: {
              $in: StorageLocations.map((x) => x._id),
            },
          },
          Deleted: false,
        }).populate('RLot')
      ).sort((a, b) => a.Date - b.Date);

      blanketDataObject.rlot = rLotAllocations
        .map((x) => {
          let rlotObj = {};
          rlotObj.r_lot_numb = x.RLot;
          return rlotObj;
        })
        .filter((item, i, ar) => ar.indexOf(item.r_lot_numb) === i);
      // }

      // console.log('hangingSheds location', hangingSheds);
      // if (pickingDetails.blanket_data !== undefined) {
      // console.log('====>', hangingSheds[0].Datetime);
      blanketDataObject.blanket_date = [
        {
          begin_dt:
            hangingSheds.length > 0 ? hangingSheds[0].Datetime : undefined,
          end_dt:
            hangingSheds.length > 0
              ? hangingSheds[hangingSheds.length - 1].Datetime
              : undefined,
        },
      ];
      // }
      // console.log('4===>', pickingDetails.date);
      // if (pickingDetails.blanket_data !== undefined) {
      blanketDataObject.wet_date = [
        {
          begin_dt: wetProcesses.length > 0 ? wetProcesses[0].Date : undefined,
          end_dt:
            wetProcesses.length > 0
              ? wetProcesses[wetProcesses.length - 1].Date
              : undefined,
        },
      ];
      // }

      blanketDataObject.intake_date = [
        {
          begin_dt: procurements.length > 0 ? procurements[0].Date : undefined,
          end_dt:
            procurements.length > 0
              ? procurements[procurements.length - 1].Date
              : undefined,
        },
      ];

      // pickingDetails.blanket_data = blanketDataObject;

      let rawMaterialComposition = await Procurement.aggregate([
        {
          $lookup: {
            from: 'Country',
            localField: 'Country',
            foreignField: '_id',
            as: 'Country',
          },
        },
        {
          $unwind: {
            path: '$Country',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'Province',
            localField: 'Province',
            foreignField: '_id',
            as: 'Province',
          },
        },
        {
          $unwind: {
            path: '$Province',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'District',
            localField: 'District',
            foreignField: '_id',
            as: 'District',
          },
        },
        {
          $unwind: {
            path: '$District',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: 'SourceArea',
            localField: 'SubDistrict',
            foreignField: '_id',
            as: 'SubDistrict',
          },
        },
        {
          $unwind: {
            path: '$SubDistrict',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            Country: 1,
            Province: 1,
            District: 1,
            SubDistrict: 1,
            GrossWeight: 1,
            StorageLocation: 1,
            Deleted: 1,
          },
        },
        {
          $match: {
            StorageLocation: {
              $in: wetProcessDetails.map((x) => x.StorageLocation),
            },
            Deleted: false,
          },
        },
        {
          $group: {
            _id: {
              Province: '$Province',
              District: '$District',
              SubDistrict: '$SubDistrict',
              Country: '$Country',
            },
            GrossWeight: { $sum: { $toDouble: '$GrossWeight' } },
          },
        },
      ]);

      let procurementData = await Procurement.aggregate([
        {
          $match: {
            StorageLocation: {
              $in: wetProcessDetails.map((x) => x.StorageLocation),
            },
            Deleted: false,
          },
        },
      ]);
      const totalGrossWeight = rawMaterialComposition.reduce(
        (a, b) => a + b.GrossWeight,
        0
      );
      function addPrct(area, id) {
        return procurementData
          .filter((proc) => proc[area].toString() === id.toString())
          .reduce((a, b) => a + Number(b.GrossWeight), 0);
      }
      const filterCompositionData = rawMaterialComposition.map((comp) => {
        let compositionObject = {};
        compositionObject['area_country'] = comp._id.Country.name;
        compositionObject['area_province'] = comp._id.Province.Name;
        compositionObject['area_District'] = comp._id.District.Name;
        compositionObject['area_SubDistrict'] = comp._id.SubDistrict.SubDistrict;
        compositionObject['proc_gross_qty'] = Number (comp.GrossWeight);
        /* (
          (comp.GrossWeight / totalGrossWeight) *
          100
        ).toFixed(2); */
        compositionObject['composition_prct'] = Number((
          (Number(addPrct('Country', comp._id.Country._id)) /
            totalGrossWeight) *
          100
        ).toFixed(2));
        compositionObject['composition_prct_province'] = Number((
          (Number(addPrct('Province', comp._id.Province._id)) /
            totalGrossWeight) *
          100
        ).toFixed(2));
        compositionObject['composition_prct_district'] = Number((
          (Number(addPrct('District', comp._id.District._id)) /
            totalGrossWeight) *
          100
        ).toFixed(2));
        return compositionObject;
      });

      // pickingDetails.Composition = filterCompositionData;
   
   //For Option Pallet --END-- 
    } else {
      pickingDetails.SPCData = [];
      pickingDetails.DryProcessData = [];
      pickingDetails.StorageLocations = [];
      pickingDetails.RawMaterialComposition = [];
    }


    //Michelle 211101 -  exclude blanket_data if not SI, prevent show empty dataset
    /* res.status(200).send(
      {
        info: pickingDetails,
        //michelle 210903 - keep composition outside of Info{}
        composition,
        blanket_data
        //error: null, 
      
      } ); 
    */
    
    if (caseOption === 'SI')
    { 
      res.status(200).send(
        {
          info: pickingDetails,
          composition,
          blanket_data
       
        } );

    }else 
    {
      //Lot, Pallet no Blanket data
      res.status(200).send(
      {
        info: pickingDetails,
        composition

      } 
    
      );
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err,
      data: null,
      errors: [{ propertyName: 'Server', error: 'Server Error' }],
    });
  }
};
