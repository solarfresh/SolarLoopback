const co = require('co');
const cv = require('opencv');
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

      cv.readImage(filePath, function(err, im){
        if (err) reject(err);

        var imFeature = im.col().reduce((acc, cur, idx) => {
          return acc.concat(im.row(idx));
        }, [])

        resolve(imFeature)
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
          return acc + trainedVal[0].weights[rowIdx][colIdx] * cur
        }, 0)
        return mvInnerProduct + val
      })

      ImageEstimateVar.create({
        estimate_datetime: moment(),
        filePath: filePath,
        labels: label
      });

      next();
    })
    .catch(function(err) {
      next(err.stack);
    })
  });
};
