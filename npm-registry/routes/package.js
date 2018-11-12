const express = require("express");
const request = require("request-promise-native");
const router = express.Router();

const cleanupVersion = version => {
  if (version.substr(0, 1) === "^" || version.substr(0, 1) === "~") {
    return version.substr(1);
  }
  return version;
};

const getDependencies = async (name, version) => {
  let response = await request(
    `https://registry.npmjs.org/${name}/${version}`,
    {
      resolveWithFullResponse: true,
      json: true
    }
  );
  let dependencies = response.body.dependencies;

  if (!dependencies) {
    return [];
  }

  let dependencyNames = Object.keys(dependencies);

  return dependencyNames.map(dependency => {
    return [dependency, cleanupVersion(dependencies[dependency])];
  });
};

const getTransitiveDependencies = async (name, version) => {
  let directDependencies = await getDependencies(name, version);

  let dependencies = [...directDependencies];

  for (let [depName, depVersion] of directDependencies) {
    dependencies = [
      ...dependencies,
      ...(await getTransitiveDependencies(depName, depVersion))
    ];
  }
  return dependencies;
};

/* GET package information. */
router.get("/:packageName/:packageVersion?", async (req, res, next) => {
  let packageName = req.params.packageName;
  let packageVersion = req.params.packageVersion || "latest";

  let dependencies = await getTransitiveDependencies(
    packageName,
    packageVersion
  );

  res.send(dependencies);
});

module.exports = router;
