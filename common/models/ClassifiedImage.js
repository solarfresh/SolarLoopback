const cv = require('opencv');

module.exports = function(ClassifiedImage) {
  ClassifiedImage.afterRemote('upload', function(ctx, modelInstance, next) {
    const file = modelInstance.result.files.file[0],
          container = file.container,
          fileName = file.name;
    const filePath = "/home/api/files/" + container + "/" + fileName;

    cv.readImage(filePath, function(err, im){
      if (err) throw err;

      var imFeature = im.col().reduce((acc, cur, idx) => {
        return acc.concat(im.row(idx));
      }, [])

      console.log(imFeature)
    })

    next();
  });
};
