const cv = require('opencv');

module.exports = function(ClassifiedImage) {
  ClassifiedImage.afterRemote('upload', function(ctx, modelInstance, next) {
    const file = modelInstance.result.files.file[0],
          container = file.container,
          fileName = file.name;
    const filePath = "/home/api/files/" + container + "/" + fileName;

    console.log(filePath)

    cv.readImage(filePath, function(err, im){
      if (err) throw err;
      console.log(im.width())
      console.log(im.height())
      console.log(im.row())

    })

    next();
  });
};
