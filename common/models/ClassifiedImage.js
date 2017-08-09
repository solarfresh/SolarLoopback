const co = require('co');
const gm = require("gm");
const jpeg = require("jpeg-js")
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

      gm(filePath)
        .channel("Red")
	.toBuffer('jpg', (err, buffer) => {
          if (err) reject(err);

          const image = jpeg.decode(buffer, true)
          var grayScale = image.data.reduce((acc, cur, idx) => {
            switch(idx % 4) {
              case 0:
                acc.push(cur);
                break;
              case 1:
                acc[acc.length - 1] += cur;
                break;
              case 2:
                acc[acc.length - 1] += cur;
                break;
              case 3:
                acc[acc.length - 1] /= 255.0;
                break;
            }
            return acc
	  }, [])

          resolve(grayScale)
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

      ImageEstimateVar.create({
        estimate_datetime: moment(),
        filePath: filePath,
        labels: label
      });

      ctx.result["labels"] = label;

      next();
    })
    .catch(function(err) {
      next(err.stack);
    })
  });
};
