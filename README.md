# node-api
Creating a Node API using Clean Architecture and Test Driven Development (TDD)

Steps to setup the project:
    1. Install lynter `npm i standard -D` for code quality
    2. Install lint-staged: `npm i lint-staged -D` for safety. It will prevent building code that is not in the stage area, which will avoid pushing broken code into production.
        * Added on the 'package.json' the "lint-staged": { ["standard"] }. This will force the project to build all files that are on the staged area using the standard library, ensuring that the code is validated before building it. 
    3. Installed Husky `npm i husky@latest -D` to enable hooks to be executed before commiting
        * Addet to the 'package.json' the line "husky":{ "hooks":{"pre-commit":"lint-staged"} }. This enable the hook to be executed before commiting. This will build the project in the staged area and verify for code quality because of the standard library.
    4. Installed Jest `npm i jest -D` to execute the tests for the TDD.
        * `npm init jest@latest` initiates Jest.