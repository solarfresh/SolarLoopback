
module.exports = function(ClassifiedImage) {
  ClassifiedImage.afterRemote('upload', function(ctx, modelInstance, next) {
    console.log("ctx:")
    console.log(ctx.instance)
    console.log("instance")
    console.log(modelInstance.result.files.file)

    next();
  });
};