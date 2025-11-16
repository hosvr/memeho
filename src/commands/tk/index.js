const { run } = require("./run")

const tarkov_wipes = [
  { name: 'all', value: 'all' },
  { name: '2020-05-20', value: '2020-05-20' },
  { name: '2020-12-25', value: '2020-12-25' },
  { name: '2021-06-29', value: '2021-06-29' },
  { name: '2021-12-12', value: '2021-12-12' },
  { name: '2022-06-29', value: '2022-06-29' },
  { name: '2022-12-28', value: '2022-06-29' },
  { name: '2023-08-10', value: '2023-08-10' },
  { name: '2023-12-27', value: '2023-12-27' },
  { name: '2024-12-26', value: '2024-12-26' },
  { name: '2025-11-15', value: '2025-11-15' }
]

const list = {
  "name": "list",
  "description": "see team kill summaries",
  "type": 1,
  "options": [
    {
      "name": "wipe",
      "description": "See team kill summary for previous wipes",
      "type": 3,
      "required": false,
      "choices": tarkov_wipes
    }
  ]
}

const user = {
  "name": "user",
  "description": "see the team kill summary for a user",
  "type": 1,
  "options": [
    {
      "name": "name",
      "description": "See team kill summary for specified user",
      "type": 6,
      "required": false
    }
  ]
}

const add = {
  "name": "add",
  "description": "Add a team kill instance",
  "type": 1,
  "options": [
    {
      "name": "killer",
      "description": "discord member who TK'd",
      "type": 6,
      "required": true
    },
    {
      "name": "victim",
      "description": "discord member who ded",
      "type": 6,
      "required": true
    },
    {
      "name": "comment",
      "description": "any additional comments to add",
      "type": 3,
      "required": false
    }
  ]
}

module.exports = {
  run,
  name: "tk",
  description: "see EFT team kill data",
  options: [ list, user, add ]
}
