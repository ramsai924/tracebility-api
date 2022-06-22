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

exports.getSILotPalletDetailForTraceability = async (req, res) => {
  try {
    console.log(req.params);
    let pickingDetails = [];
    let pallets = [];
    let lots = [];
    let testResults = [];
    let factoryId = '';
    switch (req.params.Option) {
      case 'SI':
        let si = await ShippingInstruction.findOne({
          $and: [
            { SINo: req.params.PickingId },
            { $expr: { $eq: [{ $year: '$Date' }, Number(req.params.year)] } },
          ],
        }).populate({
          path: 'Buyer Destination ProductGrade PackingType Factory',
        });

        factoryId = si.Factory;
        pickingDetail = si.toObject();
        pickingDetails.contract_numb = si.Contract;
        pickingDetails.si_numb = si.SINo;
        pickingDetails.si_destination = si.Destination.Destination;
        pickingDetails.si_port_of_shipment = si.PortOfShipment;
        pickingDetails.contract_buyer_nm = si.Buyer.name;
        pickingDetails.grade_cd = si.ProductGrade.GradeCode;
        pickingDetails.grade_nm = si.ProductGrade.GradeName.toUpperCase();
        pickingDetails.packing_typ_nm =
          si.PackingType.PckTypeName.toUpperCase();
        pickingDetails.weight = si.Weight;
        pickingDetails.pallet_shipping_dt = si.ShipDate;
        pickingDetails.pallet_stuffing_location = si.StuffingLocation;

        let shipping = await Shipping.find({
          ShippingInstruction: mongoose.Types.ObjectId(si._id),
        });
        pickingDetails.StuffingDate =
          shipping.length > 0 ? shipping[0].Date : '';
        pickingDetails.StuffingLocation =
          shipping.length > 0 ? shipping[0].StuffingLocation.Name : '';
        lots = await Lot.find({
          ShippingInstruction: mongoose.Types.ObjectId(si._id),
          Deleted: false,
        });
        lots = lots.map((result) => {
          return result.toObject();
        });
        pickingDetails.Lots = lots;
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
        });
        pickingDetails.Pallets = pallets;

        const SI_productionDates = pallets
          .map((pallet) => pallet.ProductionDate)
          .sort((a, b) => new Date(a) - new Date(b));
        const SI_testDates = pallets
          .map((pallet) => pallet.TestDate)
          .sort((a, b) => new Date(a) - new Date(b));

        pickingDetails.date = [
          {
            description: 'Production Date',
            begin_dt: SI_productionDates[0],
            end_dt: SI_productionDates[SI_productionDates.length - 1],
          },
          {
            description: 'Test Date',
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

        pickingDetails.TestResults = [
          testResultAverage(
            testresult_PO_array,
            testresult_PRI_array,
            testresult_Dirt_array,
            testresult_Ash_array,
            testresult_Mooney_array
          ),
          testResultMax(
            testresult_PO_array,
            testresult_PRI_array,
            testresult_Dirt_array,
            testresult_Ash_array,
            testresult_Mooney_array
          ),
          testResultMin(
            testresult_PO_array,
            testresult_PRI_array,
            testresult_Dirt_array,
            testresult_Ash_array,
            testresult_Mooney_array
          ),
        ];

        //storage location details
        const storageLocationModelData = await storageLocationModel.find({
          Factory: factoryId,
        });
        const storageLocationIds = storageLocationModelData.map((str) =>
          mongoose.Types.ObjectId(str._id)
        );
        const stroRageLocationDetails = await storageLocationDetailsModel.find({
          StorageLocation: storageLocationIds,
        });

        //hs detail
        const hsDetailsModelData = await hsMasterModel.find({
          Factory: factoryId,
        });
        const hsMasterIds = hsDetailsModelData.map((hs) =>
          mongoose.Types.ObjectId(hs._id)
        );
        const hsMasterDetailsData = await hsMasterDetails.find({
          HSMaster: hsMasterIds,
        });

        pickingDetails.blanket_data = {
          storage_location: stroRageLocationDetails.map((strDetail) => {
            let storageLocationObj = {};
            storageLocationObj.storage_number_result = strDetail.NumberResult;
            return storageLocationObj;
          }),
          HS: hsMasterDetailsData.map((hsDetail) => {
            let hsDetailObj = {};
            hsDetailObj.hs_number_result = hsDetail.NumberResult;
            return hsDetailObj;
          }),
        };
        break;
      case 'Lot':
        let lot = await Lot.findOne({ LotNumber: req.params.PickingId })
          .populate({
            path: 'ShippingInstruction',
            populate: 'Buyer Destination',
          })
          .populate('ProductGrade PackingType');
        factoryId = lot.Factory;
        pickingDetails.contract_numb = lot.ShippingInstruction.Contract;
        pickingDetails.lot_numb = lot.LotNumber;
        pickingDetails.si_destination =
          lot.ShippingInstruction.Destination.Destination;
        pickingDetails.si_port_of_shipment =
          lot.ShippingInstruction.PortOfShipment;
        pickingDetails.contract_buyer_nm = lot.ShippingInstruction.Buyer.name;
        pickingDetails.grade_cd = lot.ProductGrade.GradeCode;
        pickingDetails.grade_nm = lot.ProductGrade.GradeName;
        pickingDetails.packing_typ_nm = lot.PackingType.PckTypeName;
        pickingDetails.weight = lot.ShippingInstruction.Weight;
        pickingDetails.pallet_shipping_dt = lot.ShippingInstruction.ShipDate;
        pickingDetails.pallet_stuffing_location =
          lot.ShippingInstruction.StuffingLocation;

        pallets = await Pallet.find({ Lot: lot._id, Deleted: false });
        pickingDetails.Pallets = pallets;
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
          }
        );
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
        pickingDetails.TestResults = [
          testResultAverage(
            testresult_PO_array_lot,
            testresult_PRI_array_lot,
            testresult_Dirt_array_lot,
            testresult_Ash_array_lot,
            testresult_Mooney_array_lot
          ),
          testResultMax(
            testresult_PO_array,
            testresult_PRI_array,
            testresult_Dirt_array,
            testresult_Ash_array,
            testresult_Mooney_array
          ),
          testResultMin(
            testresult_PO_array,
            testresult_PRI_array,
            testresult_Dirt_array,
            testresult_Ash_array,
            testresult_Mooney_array
          ),
        ];
        break;
      case 'Pallet':
        let pallet = await Pallet.findOne({ SeqPallet: req.params.PickingId })
          .populate('ProductGrade PackingType')
          .populate({
            path: 'ShippingInstruction',
            populate: 'Buyer Destination',
          })
          .populate({
            path: 'Lot',
            populate: {
              path: 'ShippingInstruction',
              populate: 'Buyer Destination',
            },
          });
        factoryId = pallet.Factory;
        pickingDetails.pallet_numb = pallet.SeqPallet;
        pickingDetails.contract_numb = pallet.ShippingInstruction.Contract;
        pickingDetails.si_destination =
          pallet.ShippingInstruction.Destination.Destination;
        pickingDetails.si_port_of_shipment =
          pallet.ShippingInstruction.PortOfShipment;
        pickingDetails.contract_buyer_nm =
          pallet.ShippingInstruction.Buyer.name;
        pickingDetails.grade_cd = pallet.ProductGrade.GradeCode;
        pickingDetails.grade_nm = pallet.ProductGrade.GradeName;
        pickingDetails.packing_typ_nm = pallet.PackingType.PckTypeName;
        pickingDetails.weight = pallet.ShippingInstruction.Weight;
        pickingDetails.pallet_shipping_dt = pallet.ShippingInstruction.ShipDate;
        pickingDetails.pallet_stuffing_location =
          pallet.ShippingInstruction.StuffingLocation;

        pallets = [pallet.toObject()];
        if (
          (pickingDetails.ShippingInstruction === null ||
            pickingDetails.ShippingInstruction === undefined) &&
          pickingDetails.Lot !== null &&
          pickingDetails.Lot !== undefined
        ) {
          pickingDetails.ShippingInstruction =
            pickingDetails.Lot.ShippingInstruction;
        }
        testResults = await TestResult.find(
          { Pallet: pallet._id },
          {
            PO: 1,
            Mooney: 1,
            Dirt: 1,
            Ash: 1,
            PRI: 1,
          }
        );
        pickingDetails.TestResults = testResults.map((d) => {
          return d.toObject();
        });
        break;
    }

    //test result function

    function testResultAverage(
      testresult_PO_array,
      testresult_PRI_array,
      testresult_Dirt_array,
      testresult_Ash_array,
      testresult_Mooney_array
    ) {
      return {
        description: 'Avg',
        testresult_PO: Number(
          (
            testresult_PO_array.reduce((acc, cur) => acc + cur, 0) /
            testresult_PO_array.length
          ).toFixed(2)
        ),
        testresult_PRI: Number(
          (
            testresult_PRI_array.reduce((acc, cur) => acc + cur, 0) /
            testresult_PRI_array.length
          ).toFixed(2)
        ),
        testresult_Dirt: Number(
          (
            testresult_Dirt_array.reduce((acc, cur) => acc + cur, 0) /
            testresult_Dirt_array.length
          ).toFixed(2)
        ),
        testresult_Ash: Number(
          (
            testresult_Ash_array.reduce((acc, cur) => acc + cur, 0) /
            testresult_Ash_array.length
          ).toFixed(2)
        ),
        testresult_Mooney: Number(
          (
            testresult_Mooney_array.reduce((acc, cur) => acc + cur, 0) /
            testresult_Mooney_array.length
          ).toFixed(2)
        ),
      };
    }

    function testResultMax(
      testresult_PO_array,
      testresult_PRI_array,
      testresult_Dirt_array,
      testresult_Ash_array,
      testresult_Mooney_array
    ) {
      return {
        description: 'Max',
        testresult_PO: Number(Math.max(...testresult_PO_array).toFixed(2)),
        testresult_PRI: Number(Math.max(...testresult_PRI_array).toFixed(2)),
        testresult_Dirt: Number(Math.max(...testresult_Dirt_array).toFixed(2)),
        testresult_Ash: Number(Math.max(...testresult_Ash_array).toFixed(2)),
        testresult_Mooney: Number(
          Math.max(...testresult_Mooney_array).toFixed(2)
        ),
      };
    }

    function testResultMin(
      testresult_PO_array,
      testresult_PRI_array,
      testresult_Dirt_array,
      testresult_Ash_array,
      testresult_Mooney_array
    ) {
      return {
        description: 'Min',
        testresult_PO: Number(Math.min(...testresult_PO_array).toFixed(2)),
        testresult_PRI: Number(Math.min(...testresult_PRI_array).toFixed(2)),
        testresult_Dirt: Number(Math.min(...testresult_Dirt_array).toFixed(2)),
        testresult_Ash: Number(Math.min(...testresult_Ash_array).toFixed(2)),
        testresult_Mooney: Number(
          Math.min(...testresult_Mooney_array).toFixed(2)
        ),
      };
    }

    if (pallets.length > 0) {
      pallets = pallets.sort((a, b) => a.ProductionDate - b.ProductionDate);
      let productionDateBegin = pallets[0].ProductionDate;
      let productionDateEnd = pallets[pallets.length - 1].ProductionDate;
      let spcDatas = (
        await SPCData.find({
          Datetime: {
            $gte: productionDateBegin,
            $lt: productionDateEnd.setDate(productionDateEnd.getDate() + 1),
          },
          Factory: factoryId,
          Deleted: false,
        })
      ).map((d) => {
        return d.toObject();
      });
      pickingDetails.SPCData = spcDatas.map((spc) => {
        let spcObject = {};
        spcObject['spc_temp1'] = spc.Temp1;
        spcObject['spc_temp2'] = spc.Temp2;
        spcObject['spc_temp3'] = spc.Temp3;
        spcObject['spc_timer'] = spc.Timer;
        spcObject['spc_biscuit_temp'] = spc.BiscuitTemp;
        spcObject['spc_biscuit_weight'] = spc.BiscuitWeight;

        return spcObject;
      });

      let dryProcessDatas = (
        await DryProcess.find({
          Date: {
            $gte: productionDateBegin,
            $lt: productionDateEnd.setDate(productionDateEnd.getDate() + 1),
          },
          Factory: factoryId,
          HSMaster_Detail: { $ne: null },
          Deleted: false,
        }).populate('HSMaster_Detail RMWetProcess')
      ).map((d) => {
        return d.toObject();
      });
      pickingDetails.DryProcessData = dryProcessDatas;

      let hsMaster_Details = dryProcessDatas.map((x) => x.HSMaster_Detail._id);
      let hangingSheds = (
        await HangingShed.find({
          HSMaster_Detail: { $in: hsMaster_Details },
          Factory: factoryId,
          Deleted: false,
        })
      ).sort((a, b) => a.Datetime - b.Datetime);

      pickingDetails.blanket_data['blanket_date'] = [
        {
          begin_dt:
            hangingSheds.length > 0 ? hangingSheds[0].Datetime : undefined,
          end_dt:
            hangingSheds.length > 0
              ? hangingSheds[hangingSheds.length - 1].Datetime
              : undefined,
        },
      ];

      let wetProcesses = (
        await WetProcess.find({
          _id: { $in: hangingSheds.map((x) => x.RMWetProcess) },
          Factory: factoryId,
          Deleted: false,
        })
      ).sort((a, b) => a.Date - b.Date);

      pickingDetails.blanket_data['wet_date'] = [
        {
          begin_dt: wetProcesses.length > 0 ? wetProcesses[0].Date : undefined,
          end_dt:
            wetProcesses.length > 0
              ? wetProcesses[wetProcesses.length - 1].Date
              : undefined,
        },
      ];

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

      pickingDetails.blanket_data['intake_date'] = [
        {
          begin_dt: procurements.length > 0 ? procurements[0].Date : undefined,
          end_dt:
            procurements.length > 0
              ? procurements[procurements.length - 1].Date
              : undefined,
        },
      ];

      pickingDetails.StorageLocations = procurements
        .map((x) => x.StorageLocation)
        .filter((item, i, ar) => ar.indexOf(item) === i);
      let rLotAllocations = (
        await RLotAllocation.find({
          StorageLocation_Detail: {
            $elemMatch: {
              $in: pickingDetails.StorageLocations.map((x) => x._id),
            },
          },
          Deleted: false,
        }).populate('RLot')
      ).sort((a, b) => a.Date - b.Date);

      pickingDetails.blanket_data['rlot'] = rLotAllocations
        .map((x) => {
          let rlotObj = {};
          rlotObj.r_lot_numb = x.RLot;
          return rlotObj;
        })
        .filter((item, i, ar) => ar.indexOf(item.r_lot_numb) === i);

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
        compositionObject['area_SubDistrict'] =
          comp._id.SubDistrict.SubDistrict;
        compositionObject['proc_gross_qty'] = (
          (comp.GrossWeight / totalGrossWeight) *
          100
        ).toFixed(2);
        compositionObject['composition_prct'] = (
          (Number(addPrct('Country', comp._id.Country._id)) /
            totalGrossWeight) *
          100
        ).toFixed(2);
        compositionObject['composition_prct_province'] = (
          (Number(addPrct('Province', comp._id.Province._id)) /
            totalGrossWeight) *
          100
        ).toFixed(2);
        compositionObject['composition_prct_district'] = (
          (Number(addPrct('District', comp._id.District._id)) /
            totalGrossWeight) *
          100
        ).toFixed(2);
        return compositionObject;
      });

      pickingDetails.Composition = filterCompositionData;

      const factoryData = await factoryModel.findOne({ _id: factoryId });
      pickingDetails.factory_cd = factoryData ? factoryData.FctyCode : '';
      pickingDetails.factory_nm = factoryData ? factoryData.FctyName : '';
      // console.log(rawMaterialComposition);
    } else {
      pickingDetails.SPCData = [];
      pickingDetails.DryProcessData = [];
      pickingDetails.StorageLocations = [];
      pickingDetails.RawMaterialComposition = [];
    }
    res.status(200).send({
      message: 'Succeed',
      data: pickingDetails,
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Oops, something went wrong while processing your request.',
      data: null,
      errors: [{ propertyName: 'Server', error: 'Server Error' }],
    });
  }
};
