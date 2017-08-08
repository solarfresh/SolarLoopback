const cv = require('opencv');

module.exports = function(ClassifiedImage) {
  ClassifiedImage.afterRemote('upload', function(ctx, modelInstance, next) {
    var file = modelInstance.result.files.file[0],
        container = file.container,
        fileName = file.name;
    var filePath = "/home/api/files" + container + fileName;

    cv.readImage(filePath, function(err, im){
      console.log(im)
    })

    next();
  });
};