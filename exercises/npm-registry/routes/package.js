const express = require('express');
const request = require('request-promise-native');
const router = express.Router();

/* GET package information. */
router.get('/:packageName/:packageVersion?', async (req, res, next) => {
  const { params } = req;
  // const params = req.params;
  const packageVersion = params.packageVersion || 'latest';


  let dependencyPackageName = Object.keys(data.dependencies);
  let dependencyPackageVersion = Object.values(data.dependencies);

  const npmRes = await request(`https://registry.npmjs.org/${params.packageName}/${packageVersion}`, {
    resolveWithFullResponse: true,
    json: true,
  })
    .then.map(data => 
      request(`https://registry.npmjs.org/${dependencyPackageName}/${dependencyPackageVersion}`))

  const { name, version, dependencies } = npmRes.body;

  res.status(npmRes.statusCode)
    .json({
      name,
      version,
      dependencies
    });
});

module.exports = router;