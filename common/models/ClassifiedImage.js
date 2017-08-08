
module.exports = function(ClassifiedImage) {
  ClassifiedImage.afterRemote('upload', function(ctx, modelInstance, next) {
    console.log("ctx:")
    console.log(ctx)
    console.log("instance")
    console.log(modelInstance)

    next();
  });
};