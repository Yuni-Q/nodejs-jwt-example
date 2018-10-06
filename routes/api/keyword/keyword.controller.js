const Keyword = require("../../../models/keyword");
const _ = require("lodash");

exports.register = (req, res) => {
  const { start, keywords } = req.body;
  let newKeyword = null;

  // create a new user if does not exist
  const create = () => {
    // if (keyword) {
    //   throw new Error("keyword exists");
    // } else {
    return Keyword.create(start, keywords);
    // }
  };

  // count the number of the user
  const count = keywords => {
    return Keyword.count({}).exec();
  };

  const respond = () => {
    res.json({
      message: "registered successfully"
    });
  };

  // run when there is an error (username exists)
  const onError = error => {
    res.status(409).json({
      message: error.message
    });
  };

  // check username duplication
  Keyword.find({})
    .then(create)
    .then(count)
    .then(respond)
    .catch(onError);
  res.json(newKeyword);
};

exports.keywords = async (req, res) => {
  const keywords = req.query.keywords;
  console.log(keywords);
  b = {};

  c = await Keyword.aggregate([
    { $unwind: "$keywords" },
    { $match: { keywords: keywords } },
    {
      $group: {
        _id: { start: "$start", keywords: "$keywords" },
        count: { $sum: 1 }
      }
    }
  ]);
  //.then(k => {
  //   let a = [];
  //   k.forEach(element => {
  //     console.log(element);
  //     if (element.keywords.includes(keywords)) {
  //       a.push(element);
  //     }
  //   });
  //   console.log(a);
  //   a = _.groupBy(a, "start");

  //   for (const key of Object.keys(a)) {
  //     b[key] = a[key].length;
  //   }
  // });

  // res.send(b);
  res.send(c);
};
