const getLogs = async (req, res, next) => {
  const { path } = req.params;
  const company = req.company;

  //Use the path to set the modelname as per the modelname convention
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1, path.length - 1);

  const modelName = `${capitalizeFirstLetter(path)}Logs`;

  //Import the model dynamically
  const ModelPath = `../models/${modelName}`;
  const AlternativeModelPath = `../models/${path}/${modelName}`;

  let Model;

  try {
    Model = require(ModelPath);
  } catch (error) {
    console.log(
      `Failed to load ${ModelPath}, trying ${AlternativeModelPath}...`
    );
    try {
      Model = require(AlternativeModelPath);
    } catch (alternativeError) {
      console.error(`Failed to load ${AlternativeModelPath}.`);
      throw alternativeError;
    }
  }

  //Fetch the logs
  try {
    const logs = await Model.find({ company });

    return res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = getLogs;
