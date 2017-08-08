const co = require('co');
const gm = require("gm");
const moment = require('moment');

module.exports = function(ClassifiedImage) {
  var reshapeImage = function(filePath, cb) {
    return new Promise((resolve, reject) => {
      if (cb) {
        resolve = function(ret) {
          cb(null, ret)
        };
        reject = cb;
      }

      gm(filePath).color(function(err, value) {
        if (err) reject(err);

console.log(value)
        resolve(value)
      })
    })
  }

  ClassifiedImage.afterRemote('upload', function(ctx, modelInstance, next) {
    const file = modelInstance.result.files.file[0],
          container = file.container,
          fileName = file.name;
    const filePath = "/home/api/files/" + container + "/" + fileName;
    var ImageTrainVar = ClassifiedImage.app.models.ImageTrainVar;
    var ImageEstimateVar = ClassifiedImage.app.models.ImageEstimateVar;

    co(function*() {
      const imFeature = yield reshapeImage(filePath);
      const trainedVal = yield ImageTrainVar.find({
        fields: ["weights", "bias"],
        order: "train_datetime DESC",
        limit: 1
      });
      const label = trainedVal[0].bias.map((val, rowIdx) => {
        const mvInnerProduct = imFeature.reduce((acc, cur, colIdx) => {
          return acc + trainedVal[0].weights[colIdx][rowIdx] * cur
        }, 0)
        return mvInnerProduct + val
      })
console.log(label)

      //ImageEstimateVar.create({
      //  estimate_datetime: moment(),
      //  filePath: filePath,
      //  labels: label
      //});

      next();
    })
    .catch(function(err) {
      next(err.stack);
    })
  });
};
