# Emergency Department COVID-19 Severity Classification

This repository houses the source for building a CPG-on-FHIR content implementation guide for an Emergency Department COVID-19 Severity Classification. This logic represents an initial Minimum Viable Product (MVP) that implements a subset of the logic defined by the American College of Emergency Physicians (ACEP).  Refer to the [ACEP Guideline](https://www.acep.org/globalassets/sites/acep/media/covid-19-main/acep_evidencecare_covid19severitytool.pdf).

This MVP implementation is intended to align with, and eventually be replaced by, an equivalent logic library with substantially expanded functionality that is generated from OMG Business Process Modeling (BPM+) decision and case models, using an automated toolchain. Refer to the [Open Clinical Practice Guidelines](https://github.com/OpenCPG) GitHub project.

The contents of this repository are licensed under an Apache 2.0 License with an additional healthcare related disclaimer and limitation of warranty. See the [LICENSE](LICENSE) page for details.

## Content IG Walkthrough: Setup and Build

This repository provides a walkthrough of building a FHIR content implementation guide (content IG). A content IG is a FHIR implementation guide that primarily contains knowledge artifacts such as decision support rules and quality measures. By using the FHIR publication toolchain, these artifacts are made available as FHIR resources, published within websites for documentation and dissemination, and distributed as part of NPM packages for implementation.

This walkthrough consists of 5 main steps:

1. [**Setup**](#basic-setup): Setting up the IG and getting a basic build
2. [**Library**](#adding-a-library): Including a simple Library for a specific recommendation
3. [**PlanDefinition**](#adding-a-plandefinition): Adding a PlanDefinition to surface the recommendation as a decision support rule
4. [**Test Cases**](#adding-test-cases): Adding test cases to test the rule
5. [**Validation**](#validation-with-cqf-ruler-and-cds-hooks): Validating the content works as expected via the CDS Hooks Sandbox


## Basic Setup

The first step is to get a local [clone](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) of the walkthrough repository.

Once you have a local clone, you'll need to build:

### Dependencies

Before you're able to build this IG you'll need to install several dependencies

#### Java / IG Publisher

Go to [https://adoptopenjdk.net/](https://adoptopenjdk.net/) and download the latest (version 8 or higher) JDK for your platform, and install it.

There are scripts in this repository that will download and run the latest HL7 IG Publisher.

Please make sure that the Java bin directory is added to your path.

This project includes scripts that will automatically download the correct version of the IG-Publisher.

Documentation for the IG-Publisher is available at [https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation).

#### Ruby / Jekyll

Jekyll requires Ruby version 2.1 or greater. Depending on your operating system, you may already have Ruby bundled with it. Otherwise, or if you need a newer version, go to [https://www.ruby-lang.org/en/downloads/](https://www.ruby-lang.org/en/downloads/) for directions.

Jekyll

Go to [https://jekyllrb.com](https://jekyllrb.com) and follow the instructions there, for example gem install jekyll bundler. The end result of this should be that the binary "jekyll" is now in your path.

### Build

Once you have the dependencies installed, you can build the IG by first updating the publisher:

```
_updatePublisher
```

Once the publisher has been downloaded to your local environment, you can build the IG:

```
_genonce
```

Whenever you make changes to the source content, just rerun the `_genonce` script to rebuild the IG. The IG output will be in the output folder. Using a browser, open the `index.html` page to see the IG.

NOTE: This walkthrough uses "contentig" as the name of the implementation guide. The source ImplementationGuide resource is in the [contentig.xml](input/contentig.xml) file, and the [ig.ini](ig.ini) file refers to it. To change the name of the ig, be sure to update all references to `contentig` within the ImplementationGuide resource. Note that this name serves as part of the basis for the canonical URL for your IG, which is used to uniquely identify the implementation guide and all the resources published within it, so it's important to choose your canonical URL appropriately. For more information see the [Canonical URLs](https://www.hl7.org/fhir/references.html#canonical) discussion topic in the FHIR specification.

## Adding a Library

The next step in this walkthrough is to build the recommendation logic as expressions of [Clinical Quality Language](http://cql.hl7.org) (CQL). CQL is a high-level, author-friendly language that is used to express clinical reasoning artifacts such as decision support rules, quality measurement population criteria, and public health reporting criteria.

### Atom CQL Support

To validate and test CQL, use the [Atom CQL Plugin](https://github.com/cqframework/atom_cql_support). Follow the instructions there to install the plugin, then open Atom on the root folder of this  content IG walkthrough.

## Publishing as an NPM Package

The IG can be packaged as an [`npm` package](https://docs.npmjs.com/packages-and-modules) for use in JavaScript applications.

### Setup Before Publishing

Please read the steps carefully before beginning.

You may be able to skip down to [Step 4. Install `jsonfile`](#4-install-jsonfile) if you have already completed the [Setup and Build](#content-ig-walkthrough-setup-and-build) steps above.

Relevant documentation:

- [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [Publishing packages using GitHub Actions](https://docs.github.com/en/packages/guides/using-github-packages-with-github-actions)
- [Configuring NPM for use with GitHub Packages](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages)

Note: Currently only supported for Linux/macOS.

### 1. Permissions for Publishing

Verify that you are able to publish packages to your target repository. The specific steps will vary depending on where you are publishing the package.

If you are publishing through [GitHub Actions](https://github.com/features/actions), you will need:

- [A personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
    - The token will need both the `write:packages` permissions (including the `read:packages`) and most or all of the `repo` permissions

### 2. Install `jekyll`

1. Install [Ruby 2.X](https://www.ruby-lang.org/en/) if not already installed
2. `gem install bundler` (installs `bundle` command)
3. `bundle install` (installs `jekyll`)

### 3. IG Build

1. Update the IG Publisher: `bash _updatePublisher.sh --force --yes`
   - `--force` and `--yes` are optional
2. Generate the IG: `bash _genonce.sh`

### 4. Install `jsonfile`

1. Install [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if not already installed
2. `npm install jsonfile`

### 5. Update the package version

1. Open `library-package.json` (at project root) and increment the [semver](https://semver.org/) value in the `version` attribute
    - e.g. `0.0.1` -> `0.0.2`

### 6. Publication

1. Publish to the repository: `bash _publishToRepo.sh`

### 7. Completion

If every step was successful, then the `_publishToRepo` script should report that the package was published. You can now check your repository to verify that the new version of the package was published successfully.

## Using the Published NPM Package

Once the IG (implementation guide) has been [published to a package repository](#publishing-as-an-npm-package), it can be imported into your JavaScript application via its package manager.

### Importing from GitHub Packages

You will need:

- [A personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
   - The token will need the `read:packages` and the `repo` permissions

### Importing via NPM

Either:

- Install from the command line, e.g. `npm install @chronic-care/covid-ed-ig@latest`
- Or, add it to your project's `package.json`, e.g. `"@chronic-care/covid-ed-ig": "latest"`

You can replace `latest` in either of the above with a specific version number (e.g. `0.0.5`) if desired.

### Testing
There are a couple of ways to test the CQL.
1. Atom Testing
2. [Unit Testing](cql-unit-tests/README.md) via the JavaScript CQL Engine

## Updating Valuesets
If new codes need to be added to a valueset, follow these steps to manually update the JSON and regenerate the `valueset-db.json` file:
1. Add new codes to the relevant JSON files in `input/vocabulary/valueset`. For labs, add to both the `compose` and `expansion` objects.
2. Run `./_updateCQFTooling.sh` script, which updates the [CQF Tooling](https://github.com/cqframework/cqf-tooling) and downloads the `jar` file into `input-cache` directory.
3. Run `java -jar input-cache/tooling-1.3.1-SNAPSHOT-jar-with-dependencies.jar -ToJsonValueSetDb -path="input/vocabulary/valueset"` (note: this is the path to the entire valueset folder)
4. The new `valueset-db.json` can be found in `src/main/resources/org/opencds/cqf/tooling/terminology/output`. Copy this over into the `input/cql` directory to replace it.