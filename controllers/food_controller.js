const config = require('../config');

/**
 * Return unparsed results of a natural language query of the Nutritionix database
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}        
 */
exports.index = function(req, res, next) {
  const q = req.query.q;

  console.log(q)
    // ensure you are passing a string with queries delimited by new lines.
  config.nutritionix.natural(q)
    .then((foodResults) => {
      return res.json(foodResults.results);
    })
    .catch((err) => {
      console.log(err);
      return next(err)
    });
}
