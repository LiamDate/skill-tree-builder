# Interactive Skill Tree Builder

React app that allows users to create and navigate a personalized skill tree.

## Setup instructions

Run the following commands:

```
npm install
npm run start
```

## Completed Bonus

I implemented the `Prevent Cycles` bonus.

## Disclosure

No AI tools were used when making this application.

## User instructions

- To create a skill, click the `Add Skill` button in the top left corner and fill in the form.
- To view a skills details, click on that skill.
- To complete a skill, double click on that skill.
- To add a prerequisite, draw a line from one skills handle to anothers.

## Testing

- I have used Vitest for the util unit tests, and Cypress for the component tests.
- The unit tests sit inside `src/utils/__tests__`, whereas the component tests sit inside the `cypress` area of the repo.
- To run the unit tests, use:

```
npm run test:unit
```

- To run the component tests in the command line (headless mode), use:

```
npm run test:component
```

- To run the component tests in the Cypress UI, use:

```
npm run test:component-ui
```
