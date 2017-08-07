// var _ = require('lodash');

module.exports = function(ImageTrainSet) {
  // require('./activeUserOverviewAfterRemote.js')(activeUserOverview);
  // activeUserOverview.delIncorrectData = function(startDate, endDate, period, cb) {
  //   console.log("delIncorrectData")
  //   return new Promise(function(resolve, reject) {
  //     if (cb) {
  //       resolve = function (ret) {
  //           cb(null, ret);
  //       };
  //       reject = cb;
  //     }
  //     co(function*() {
  //       var result = yield activeUserOverview.destroyAll({
  //         date: {between: [startDate, endDate]},
  //         period: period
  //       })

  //       resolve(result)
  //     })
  //     .catch(function(err) {
  //       reject(err);
  //     })
  //   })
  // }
  // activeUserOverview.remoteMethod(
  //   'delIncorrectData',
  //   {
  //     http: {verb: 'post'},
  //     accepts: [
  //       {arg: 'startDate', type: 'string', required: true, description:'Start date of the data. format: YYYY-MM-DD'},
  //       {arg: 'endDate', type: 'string', required: true, description:'End date of the data.'},
  //       {arg: 'period', type: 'number', required: true, description:'period of record'}
  //     ],
  //     returns: {arg: 'response', type: 'object'},
  //     description : 'delete the incorrect data.'
  //   }
  // );
}
